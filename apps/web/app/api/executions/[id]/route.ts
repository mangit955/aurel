import { prisma } from "@aurel/db";
import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const { id } = params;

  const execution = await prisma.execution.findFirst({
    where: {
      id,
      workflow: { user: { email: userEmail } },
    },
    include: {
      workflow: true,
    },
  });

  if (!execution) {
    return NextResponse.json({ error: "Execution not found" }, { status: 404 });
  }
  return NextResponse.json(execution);
}
