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
      className="flex items-center gap-1 btn btn-primary bg-zinc-200 hover:bg-zinc-400 p-1 text-zinc-800 rounded-md cursor-pointer px-2 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-600"
      onClick={saveWorkflow}
    >
      <Current size={20}></Current>
      Save
    </button>
  );
}
