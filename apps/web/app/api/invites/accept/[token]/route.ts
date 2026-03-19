import { NextResponse } from "next/server";
import { prisma } from "@aurel/db";
import { getActiveOrganizationContext } from "@/lib/organizations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not available" },
      { status: 500 },
    );
  }

  const { token } = await params;
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  return NextResponse.json({
    email: invite.email,
    role: invite.role,
    acceptedAt: invite.acceptedAt,
    expiresAt: invite.expiresAt,
    organization: invite.organization,
  });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const context = await getActiveOrganizationContext();

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 },
      );
    }

    const { token } = await params;
    const invite = await prisma.invite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.email.toLowerCase() !== context.user.email.toLowerCase()) {
      return NextResponse.json(
        {
          error: `This invite was sent to ${invite.email}. Sign in with that account to accept it.`,
        },
        { status: 403 },
      );
    }

    if (invite.acceptedAt) {
      return NextResponse.json({ error: "Invite already accepted" }, { status: 409 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invite expired" }, { status: 410 });
    }

    await prisma.$transaction([
      prisma.membership.upsert({
        where: {
          organizationId_userId: {
            organizationId: invite.organizationId,
            userId: context.user.id,
          },
        },
        update: {
          role: invite.role,
        },
        create: {
          organizationId: invite.organizationId,
          userId: context.user.id,
          role: invite.role,
        },
      }),
      prisma.invite.update({
        where: { id: invite.id },
        data: {
          acceptedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ ok: true, organizationId: invite.organizationId });
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Unauthorized"
        ? "Unauthorized"
        : "Failed to accept invite";

    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 },
    );
  }
}
