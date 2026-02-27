import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import { workflowQueue } from "@/lib/queue";

async function getPrisma() {
  try {
    const db = await import("@aurel/db");
    return db.prisma;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    return null;
  }
}

export async function POST(
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
    return NextResponse.json(
      { error: "Database not available" },
      { status: 500 },
    );
  }

  const { id } = await params;
  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      user: { email: userEmail },
    },
  });

  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  let body = {};
  try {
    const text = await req.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (error) {
    console.error("Failed to parse request body:", error);
  }

  // Create an Execution record
  const execution = await prisma.execution.create({
    data: {
      workflowId: workflow.id,
      status: "queued",
      input: body,
      logs: [],
    },
  });

  // Enqueue worker job with BullMQ
  await workflowQueue.add("run-workflow", {
    executionId: execution.id,
    workflowId: workflow.id,
    triggerData: body,
  });

  return NextResponse.json({
    message: "Workflow run initiated",
    executionId: execution.id,
  });
}
