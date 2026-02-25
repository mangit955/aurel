import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

type WorkflowRecord = {
  id: string;
  name: string;
  userId: string;
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
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = await getPrisma();
  if (!prisma) {
    const { id } = await params;
    const workflow = (workflowFallbackStore[userEmail] ?? []).find(
      (item) => item.id === id,
    );
    if (!workflow) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(workflow);
  }

  const { id } = await params;
  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      user: { email: userEmail },
    },
  });

  if (!workflow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(workflow);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = await getPrisma();
  if (!prisma) {
    const body = (await req.json()) as {
      nodes?: unknown[];
      edges?: unknown[];
    };
    const nodes = Array.isArray(body.nodes) ? body.nodes : [];
    const edges = Array.isArray(body.edges) ? body.edges : [];
    const { id } = await params;

    const list = workflowFallbackStore[userEmail] ?? [];
    const existingIndex = list.findIndex((item) => item.id === id);
    if (existingIndex >= 0) {
      const updated = {
        ...list[existingIndex],
        nodes,
        edges,
      };
      const next = [...list];
      next[existingIndex] = updated;
      workflowFallbackStore[userEmail] = next;
      return NextResponse.json(updated);
    }

    const created: WorkflowRecord = {
      id,
      name: "Untitled Workflow",
      userId: userEmail,
      nodes,
      edges,
    };
    workflowFallbackStore[userEmail] = [...list, created];
    return NextResponse.json(created);
  }

  const { id } = await params;
  const existingById = await prisma.workflow.findUnique({
    where: { id },
    include: { user: { select: { email: true } } },
  });

  if (existingById && existingById.user.email !== userEmail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await req.json()) as {
    nodes?: unknown[];
    edges?: unknown[];
  };
  const nodes = Array.isArray(body.nodes) ? body.nodes : [];
  const edges = Array.isArray(body.edges) ? body.edges : [];

  if (existingById) {
    const updated = await prisma.workflow.update({
      where: { id },
      data: {
        nodes: nodes as any,
        edges: edges as any,
      },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.workflow.create({
    data: {
      id,
      name: "Untitled Workflow",
      nodes: nodes as any,
      edges: edges as any,
      user: {
        connectOrCreate: {
          where: { email: userEmail },
          create: {
            email: userEmail,
            name: session.user?.name ?? null,
            image: session.user?.image ?? null,
          },
        },
      },
    },
  });

  return NextResponse.json(created);
}
