import { NextRequest, NextResponse } from "next/server";
import { createOrganization, getActiveOrganizationContext } from "@/lib/organizations";

export async function GET() {
  try {
    const context = await getActiveOrganizationContext();
    return NextResponse.json({
      activeOrganizationId: context.activeOrganization.id,
      organizations: context.organizations,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 },
      );
    }

    const organization = await createOrganization(name);
    return NextResponse.json(organization);
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : "Failed to create organization";

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 },
    );
  }
}
