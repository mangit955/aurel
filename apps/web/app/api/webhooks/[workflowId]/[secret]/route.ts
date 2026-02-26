import { NextResponse } from "next/server";
import { prisma } from "@aurel/db";
import { workflowQueue } from "@/lib/queue";

export async function POST(
  req: Request,
  context: { params: Promise<{ workflowId: string; secret: string }> },
) {
  const { workflowId, secret } = await context.params;

  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });

  // Reject if not found or secret mismatch
  if (!workflow || workflow.webhookSecret !== secret) {
    return NextResponse.json(
      { error: "Unauthorized or workflow not found" },
      { status: 401 },
    );
  }

  // Parse incoming JSON
  const body = await req.json();

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
    message: "Webhook received",
    executionId: execution.id,
  });
}
