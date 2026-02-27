"use client";

import { useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";

const createNode = (type: string, x: number, y: number) => ({
  id: crypto.randomUUID(),
  type,
  position: { x, y },
  data: { label: `${type} node` },
});

export function Toolbar({ workflowId }: { workflowId?: string }) {
  const { nodes, setNodes } = useWorkflowStore();
  const [isRunning, setIsRunning] = useState(false);

  const addNode = (type: string) => {
    const newNode = createNode(type, Math.random() * 400, Math.random() * 400);

    setNodes([...nodes, newNode]);
  };

  const handleRun = async () => {
    if (!workflowId) return;
    try {
      setIsRunning(true);
      const res = await fetch(`/api/workflows/${workflowId}/run`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to run workflow");
      }
      alert("Workflow run initiated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to run workflow. See console for details.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-x-2 flex">
      {/* add more buttons for different node types later */}
      <button
        onClick={() => addNode("webhookTrigger")}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border"
      >
        Webhook
      </button>
      <button
        onClick={() => addNode("httpRequest")}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border"
      >
        HTTP
      </button>
      <button
        onClick={() => addNode("setVariable")}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border"
      >
        Set
      </button>
      <button
        onClick={() => addNode("ifFilter")}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border"
      >
        If / Filter
      </button>
      <button
        onClick={() => addNode("sendEmail")}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border"
      >
        Email
      </button>
      {workflowId && (
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-primary text-primary-foreground p-1 px-2 cursor-pointer rounded-md disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Workflow"}
        </button>
      )}
    </div>
  );
}
