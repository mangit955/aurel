import type { Edge, Node } from "@xyflow/react";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { EditorClient } from "./EditorClient";

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
  const session = await auth();
  const userEmail = session?.user?.email;
  const { id } = await params;

  if (!userEmail) {
    redirect("/");
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return <EditorClient workflowId={id} initialNodes={[]} initialEdges={[]} />;
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      user: { email: userEmail },
    },
  });

  if (!workflow) {
    return <EditorClient workflowId={id} initialNodes={[]} initialEdges={[]} />;
  }

  return (
    <EditorClient
      workflowId={workflow.id}
      initialNodes={(workflow.nodes as unknown as Node[]) ?? []}
      initialEdges={(workflow.edges as unknown as Edge[]) ?? []}
    />
  );
}
