import { prisma } from "@aurel/db";
import { NextResponse } from "next/server";

export async function GET() {
  const ex = await prisma.execution.findMany({
    take: 3,
    orderBy: { startedAt: "desc" }
  });
  return NextResponse.json(ex);
}
