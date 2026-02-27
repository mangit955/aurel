"use client";

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
      className="btn btn-primary bg-zinc-200 p-1 text-zinc-800 rounded-md cursor-pointer px-2 font-semibold"
      onClick={saveWorkflow}
    >
      Save
    </button>
  );
}
