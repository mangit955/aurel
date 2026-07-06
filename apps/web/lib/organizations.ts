import { prisma } from "@aurel/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";
import { GUEST_USER, GUEST_WORKSPACE_COOKIE } from "@/lib/guest-workspace";

const roleRank = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
} as const;

export type OrganizationRole = keyof typeof roleRank;

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  role: OrganizationRole;
};

type AuthenticatedUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

type ActiveOrganizationContext = {
  user: AuthenticatedUser;
  activeOrganization: OrganizationSummary;
  organizations: OrganizationSummary[];
};

type FallbackOrganizationStore = Record<string, OrganizationSummary[]>;

const globalForFallback = globalThis as typeof globalThis & {
  fallbackOrganizations?: FallbackOrganizationStore;
};

function slugifyOrganizationName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function buildFallbackOrganization(email: string, name?: string | null) {
  const label = name?.trim() || email.split("@")[0] || "Personal";
  return {
    id: `personal_${email}`,
    name: `${label}'s Workspace`,
    slug: slugifyOrganizationName(`${label}-${email}`) || "personal-workspace",
    role: "OWNER" as const,
  };
}

function getFallbackOrganizations(
  email: string,
  name?: string | null,
): OrganizationSummary[] {
  const store = globalForFallback.fallbackOrganizations ?? {};
  if (!globalForFallback.fallbackOrganizations) {
    globalForFallback.fallbackOrganizations = store;
  }

  if (!store[email]) {
    store[email] = [buildFallbackOrganization(email, name)];
  }

  return store[email];
}

async function requireAuthenticatedUser() {
  const session = await auth();
  const sessionUser = session?.user;
  const email = sessionUser?.email?.trim().toLowerCase();
  if (email) {
    return {
      email,
      name: sessionUser?.name ?? null,
      image: sessionUser?.image ?? null,
    };
  }

  const cookieStore = await cookies();
  if (cookieStore.get(GUEST_WORKSPACE_COOKIE)?.value === "1") {
    return {
      email: GUEST_USER.email,
      name: GUEST_USER.name,
      image: GUEST_USER.image,
    };
  }

  throw new Error("Unauthorized");
}

async function ensureUserRecord() {
  const sessionUser = await requireAuthenticatedUser();

  if (!prisma) {
    return {
      id: sessionUser.email,
      email: sessionUser.email,
      name: sessionUser.name,
      image: sessionUser.image,
    } satisfies AuthenticatedUser;
  }

  return prisma.user.upsert({
    where: { email: sessionUser.email },
    update: {
      name: sessionUser.name,
      image: sessionUser.image,
    },
    create: {
      email: sessionUser.email,
      name: sessionUser.name,
      image: sessionUser.image,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });
}

async function createPersonalOrganization(user: AuthenticatedUser) {
  const baseSlug = slugifyOrganizationName(
    `${user.name?.trim() || user.email.split("@")[0]}-${user.id.slice(0, 6)}`,
  );

  return prisma!.organization.create({
    data: {
      name: `${user.name?.trim() || user.email.split("@")[0]}'s Workspace`,
      slug: baseSlug || `workspace-${user.id.slice(0, 6)}`,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
    include: {
      memberships: {
        where: { userId: user.id },
        select: { role: true },
      },
    },
  });
}

function toOrganizationSummary(
  organization: {
    id: string;
    name: string;
    slug: string;
    memberships: { role: OrganizationRole }[];
  },
): OrganizationSummary {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    role: organization.memberships[0]?.role ?? "VIEWER",
  };
}

export async function getActiveOrganizationContext(): Promise<ActiveOrganizationContext> {
  const user = await ensureUserRecord();

  if (!prisma) {
    const organizations = getFallbackOrganizations(user.email, user.name);
    const activeOrganization = organizations[0];

    return { user, activeOrganization, organizations };
  }

  let organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      memberships: {
        where: { userId: user.id },
        select: { role: true },
      },
    },
    orderBy: [{ createdAt: "asc" }],
  });

  if (organizations.length === 0) {
    organizations = [await createPersonalOrganization(user)];
  }

  const summaries = organizations.map(toOrganizationSummary);
  const activeOrganization = summaries[0];

  return {
    user,
    activeOrganization,
    organizations: summaries,
  };
}

export function hasRequiredRole(
  currentRole: OrganizationRole,
  minimumRole: OrganizationRole,
) {
  return roleRank[currentRole] >= roleRank[minimumRole];
}

export async function getWorkflowForActiveOrganization(
  workflowId: string,
  minimumRole: OrganizationRole = "VIEWER",
) {
  const context = await getActiveOrganizationContext();

  if (!prisma) {
    return {
      context,
      workflow: null,
    };
  }

  if (!hasRequiredRole(context.activeOrganization.role, minimumRole)) {
    throw new Error("Forbidden");
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      organizationId: context.activeOrganization.id,
    },
  });

  return {
    context,
    workflow,
  };
}
