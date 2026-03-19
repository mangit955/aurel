import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@aurel/db";
import { workflowQueue } from "@/lib/queue";
import { buildInviteEmailTemplate } from "@/lib/emailTemplates/invite";
import {
  getActiveOrganizationContext,
  hasRequiredRole,
  type OrganizationRole,
} from "@/lib/organizations";

const allowedRoles = new Set<OrganizationRole>([
  "ADMIN",
  "MEMBER",
  "VIEWER",
]);

export async function POST(req: NextRequest) {
  try {
    const context = await getActiveOrganizationContext();
    if (!hasRequiredRole(context.activeOrganization.role, "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as { email?: string; role?: OrganizationRole };
    const email = body.email?.trim().toLowerCase();
    const role = body.role?.trim().toUpperCase() as OrganizationRole | undefined;

    if (!email) {
      return NextResponse.json(
        { error: "Invite email is required" },
        { status: 400 },
      );
    }

    if (!role || !allowedRoles.has(role)) {
      return NextResponse.json(
        { error: "Role must be ADMIN, MEMBER, or VIEWER" },
        { status: 400 },
      );
    }

    const existingMembership = await prisma.membership.findFirst({
      where: {
        organizationId: context.activeOrganization.id,
        user: { email },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a member of this organization" },
        { status: 409 },
      );
    }

    const invite = await prisma.invite.create({
      data: {
        organizationId: context.activeOrganization.id,
        email,
        role,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        invitedByUserId: context.user.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        token: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    const inviteUrl = new URL(`/invite/${invite.token}`, req.nextUrl.origin).toString();
    const inviterName = context.user.name?.trim() || context.user.email;
    const emailPayload = buildInviteEmailTemplate({
      organizationName: context.activeOrganization.name,
      inviterName,
      inviteUrl,
      role,
    });

    try {
      await workflowQueue.add("send-email-test", {
        nodeId: `invite_${invite.id}`,
        to: email,
        subject: emailPayload.subject,
        body: emailPayload.body,
        from: process.env.RESEND_FROM_EMAIL,
      });
    } catch (queueError) {
      await prisma.invite.delete({
        where: { id: invite.id },
      });
      throw queueError;
    }

    return NextResponse.json(invite);
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : "Failed to create invite";

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 },
    );
  }
}
