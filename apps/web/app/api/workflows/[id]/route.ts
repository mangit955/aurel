import { NextRequest, NextResponse } from "next/server";
import {
  getActiveOrganizationContext,
  hasRequiredRole,
} from "@/lib/organizations";

type WorkflowRecord = {
  id: string;
  name: string;
  organizationId: string;
  nodes: unknown[];
  edges: unknown[];
};

const globalForFallback = globalThis as typeof globalThis & {
  workflowFallbackStore?: Record<string, WorkflowRecord[]>;
};

const workflowFallbackStore = globalForFallback.workflowFallbackStore ?? {};
if (!globalForFallback.workflowFallbackStore) {
  globalForFallback.workflowFallbackStore = workflowFallbackStore;
}

async function getPrisma() {
  try {
    const db = await import("@aurel/db");
    return db.prisma;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await getActiveOrganizationContext();
    const prisma = await getPrisma();
    if (!prisma) {
      const { id } = await params;
      const workflow = (
        workflowFallbackStore[context.activeOrganization.id] ?? []
      ).find((item) => item.id === id);
      if (!workflow) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(workflow);
    }

    const { id } = await params;
    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        organizationId: context.activeOrganization.id,
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await getActiveOrganizationContext();
    if (!hasRequiredRole(context.activeOrganization.role, "MEMBER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prisma = await getPrisma();
    const body = (await req.json()) as {
      nodes?: unknown[];
      edges?: unknown[];
    };
    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];
    const { id } = await params;

    if (!prisma) {
      const list = workflowFallbackStore[context.activeOrganization.id] ?? [];
      const existingIndex = list.findIndex((item) => item.id === id);
      if (existingIndex >= 0) {
        const updated = {
          ...list[existingIndex],
          nodes,
          edges,
        };
        const next = [...list];
        next[existingIndex] = updated;
        workflowFallbackStore[context.activeOrganization.id] = next;
        return NextResponse.json(updated);
      }

      const created: WorkflowRecord = {
        id,
        name: "Untitled Workflow",
        organizationId: context.activeOrganization.id,
        nodes,
        edges,
      };
      workflowFallbackStore[context.activeOrganization.id] = [...list, created];
      return NextResponse.json(created);
    }

    const existingById = await prisma.workflow.findFirst({
      where: {
        id,
        organizationId: context.activeOrganization.id,
      },
    });

    if (existingById) {
      const updated = await prisma.workflow.update({
        where: { id },
        data: {
          nodes: nodes as never,
          edges: edges as never,
        },
      });
      return NextResponse.json(updated);
    }

    const created = await prisma.workflow.create({
      data: {
        id,
        name: "Untitled Workflow",
        organizationId: context.activeOrganization.id,
        createdByUserId: context.user.id,
        nodes: nodes as never,
        edges: edges as never,
      },
    });

    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const context = await getActiveOrganizationContext();
    if (!hasRequiredRole(context.activeOrganization.role, "MEMBER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const prisma = await getPrisma();

    if (!prisma) {
      const list = workflowFallbackStore[context.activeOrganization.id] ?? [];
      const exists = list.some((item) => item.id === id);
      if (!exists) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      workflowFallbackStore[context.activeOrganization.id] = list.filter(
        (item) => item.id !== id,
      );
      return NextResponse.json({ ok: true });
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        organizationId: context.activeOrganization.id,
      },
      select: { id: true },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.execution.deleteMany({ where: { workflowId: id } }),
      prisma.workflow.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Failed to delete workflow:", error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 },
    );
  }
}
