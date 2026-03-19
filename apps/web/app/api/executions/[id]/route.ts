import { prisma } from "@aurel/db";
import { NextResponse } from "next/server";
import { getActiveOrganizationContext } from "@/lib/organizations";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const organizationContext = await getActiveOrganizationContext();
    const params = await context.params;
    const { id } = params;

    const execution = await prisma.execution.findFirst({
      where: {
        id,
        workflow: { organizationId: organizationContext.activeOrganization.id },
      },
      include: {
        workflow: true,
      },
    });

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(execution);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
