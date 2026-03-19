import { NextRequest, NextResponse } from "next/server";
import {
  ACTIVE_ORGANIZATION_COOKIE,
  assertOrganizationAccess,
} from "@/lib/organizations";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { organizationId?: string };
    const organizationId = body.organizationId?.trim();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization is required" },
        { status: 400 },
      );
    }

    await assertOrganizationAccess(organizationId);

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: ACTIVE_ORGANIZATION_COOKIE,
      value: organizationId,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : error instanceof Error && error.message === "Forbidden"
          ? "Forbidden"
          : "Failed to switch organization";

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500 },
    );
  }
}
