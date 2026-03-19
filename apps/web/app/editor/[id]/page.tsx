import type { Edge, Node } from "@xyflow/react";
import { redirect } from "next/navigation";
import { EditorClient } from "./EditorClient";
import { getActiveOrganizationContext } from "@/lib/organizations";

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

async function getPrisma() {
  try {
    const db = await import("@aurel/db");
    return db.prisma;
  } catch (error) {
    console.error("Failed to initialize Prisma client:", error);
    return null;
  }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;

  let organizationId: string;
  try {
    const context = await getActiveOrganizationContext();
    organizationId = context.activeOrganization.id;
  } catch {
    redirect("/");
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return (
      <EditorClient
        workflowId={id}
        webhookSecret=""
        initialNodes={[]}
        initialEdges={[]}
      />
    );
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!workflow) {
    redirect("/dashboard");
  }

  return (
    <EditorClient
      workflowId={workflow.id}
      webhookSecret={workflow.webhookSecret}
      initialNodes={(workflow.nodes as unknown as Node[]) ?? []}
      initialEdges={(workflow.edges as unknown as Edge[]) ?? []}
    />
  );
}
