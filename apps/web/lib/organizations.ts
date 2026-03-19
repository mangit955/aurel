import { prisma } from "@aurel/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

export const ACTIVE_ORGANIZATION_COOKIE = "aurel_active_org_id";

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
  if (!email) {
    throw new Error("Unauthorized");
  }

  return {
    email,
    name: sessionUser?.name ?? null,
    image: sessionUser?.image ?? null,
  };
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
    const cookieStore = await cookies();
    const activeId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;
    const activeOrganization =
      organizations.find((organization) => organization.id === activeId) ??
      organizations[0];

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
  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_ORGANIZATION_COOKIE)?.value;
  const activeOrganization =
    summaries.find((organization) => organization.id === activeId) ??
    summaries[0];

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

export async function assertOrganizationAccess(
  organizationId: string,
  minimumRole: OrganizationRole = "VIEWER",
) {
  const context = await getActiveOrganizationContext();
  const organization = context.organizations.find((item) => item.id === organizationId);

  if (!organization || !hasRequiredRole(organization.role, minimumRole)) {
    throw new Error("Forbidden");
  }

  return {
    ...context,
    activeOrganization: organization,
  };
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

export async function createOrganization(name: string) {
  const context = await getActiveOrganizationContext();

  if (!prisma) {
    const fallbackOrganization = {
      id: `fallback_${Date.now()}`,
      name,
      slug: slugifyOrganizationName(name) || `workspace-${Date.now()}`,
      role: "OWNER" as const,
    };
    const organizations = getFallbackOrganizations(context.user.email, context.user.name);
    organizations.push(fallbackOrganization);
    return fallbackOrganization;
  }

  const baseSlug = slugifyOrganizationName(name) || `workspace-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.organization.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
      memberships: {
        create: {
          userId: context.user.id,
          role: "OWNER",
        },
      },
    },
    include: {
      memberships: {
        where: { userId: context.user.id },
        select: { role: true },
      },
    },
  });

  return toOrganizationSummary(organization);
}
