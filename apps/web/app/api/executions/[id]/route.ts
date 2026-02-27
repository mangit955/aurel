import { prisma } from "@aurel/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const execution = await prisma.execution.findUnique({
    where: { id },
    include: {
      workflow: true,
    },
  });

  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }
  return NextResponse.json(execution);
}
