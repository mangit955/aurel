"use client";

import Current from "@/public/current";
import { useWorkflowStore } from "@/store/workflowStore";
import { useRouter } from "next/navigation";

export function SaveButton({ workflowId }: { workflowId: string }) {
  const { nodes, edges } = useWorkflowStore();
  const router = useRouter();

  const saveWorkflow = async () => {
    await fetch(`/api/workflows/${workflowId}`, {
      method: "PATCH",
      body: JSON.stringify({ nodes, edges }),
      headers: { "Content-Type": "application/json" },
    });

    router.refresh(); // refresh UI if needed
  };

  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-md border border-zinc-600/80 bg-zinc-100 px-2 py-1 font-semibold text-zinc-900 transition hover:bg-zinc-300 outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      onClick={saveWorkflow}
    >
      <Current size={20}></Current>
      Save
    </button>
  );
}
