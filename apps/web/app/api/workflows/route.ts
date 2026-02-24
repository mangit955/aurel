import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";

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

export async function GET() {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(workflowFallbackStore[userEmail] ?? []);
  }

  const workflows = await prisma.workflow.findMany({
    where: { user: { email: userEmail } },
  });

  return NextResponse.json(workflows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      userId: userEmail,
      nodes: [],
      edges: [],
    };
    workflowFallbackStore[userEmail] = [
      ...(workflowFallbackStore[userEmail] ?? []),
      fallbackWorkflow,
    ];
    return NextResponse.json(fallbackWorkflow);
  }

  const workflow = await prisma.workflow.create({
    data: {
      name: trimmedName,
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
      nodes: [],
      edges: [],
    },
  });

  return NextResponse.json(workflow);
}
