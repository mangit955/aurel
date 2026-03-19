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

export async function GET() {
  try {
    const context = await getActiveOrganizationContext();
    const prisma = await getPrisma();
    if (!prisma) {
      return NextResponse.json(
        workflowFallbackStore[context.activeOrganization.id] ?? [],
      );
    }

    const workflows = await prisma.workflow.findMany({
      where: { organizationId: context.activeOrganization.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(workflows);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const context = await getActiveOrganizationContext();
    if (!hasRequiredRole(context.activeOrganization.role, "MEMBER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: { name?: string } = await req.json();
    const trimmedName = body.name?.trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: "Workflow name is required" },
        { status: 400 },
      );
    }

    const prisma = await getPrisma();
    if (!prisma) {
      const fallbackWorkflow: WorkflowRecord = {
        id: `local_${Date.now()}`,
        name: trimmedName,
        organizationId: context.activeOrganization.id,
        nodes: [],
        edges: [],
      };
      workflowFallbackStore[context.activeOrganization.id] = [
        ...(workflowFallbackStore[context.activeOrganization.id] ?? []),
        fallbackWorkflow,
      ];
      return NextResponse.json(fallbackWorkflow);
    }

    const workflow = await prisma.workflow.create({
      data: {
        name: trimmedName,
        organizationId: context.activeOrganization.id,
        createdByUserId: context.user.id,
        nodes: [],
        edges: [],
      },
    });

    return NextResponse.json(workflow);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
