import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurel/db";
import { auth } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!body.name || !body.name.trim()) {
    return NextResponse.json(
      { error: "Workflow name is required" },
      { status: 400 },
    );
  }

  const workflow = await prisma.workflow.create({
    data: {
      name: body.name.trim(),
      user: { connect: { email: userEmail } },
      nodes: [],
      edges: [],
    },
  });

  return NextResponse.json(workflow);
}
