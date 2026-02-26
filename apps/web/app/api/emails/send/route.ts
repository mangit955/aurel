import { NextResponse } from "next/server";
import { workflowQueue } from "@/lib/queue";

export async function POST(req: Request) {
  const { nodeId, to, subject, body, from } = await req.json();

  // Enqueue a job specifically for sending this email
  await workflowQueue.add("send-email-test", {
    nodeId,
    from,
    to,
    subject,
    body,
  });

  return NextResponse.json({ success: true });
}
