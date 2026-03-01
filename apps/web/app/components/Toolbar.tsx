"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { Redo2, Undo2 } from "lucide-react";

const createNode = (type: string, x: number, y: number) => ({
  id: crypto.randomUUID(),
  type,
  position: { x, y },
  data: { label: `${type} node` },
});

export function Toolbar({ workflowId }: { workflowId?: string }) {
  const { nodes, setNodes, undo, redo, canUndo, canRedo } = useWorkflowStore();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingInField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTypingInField) return;

      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod) return;

      const key = event.key.toLowerCase();
      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        if (canRedo) redo();
        return;
      }

      if (key === "z") {
        event.preventDefault();
        if (canUndo) undo();
        return;
      }

      if (key === "y") {
        event.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo, canUndo, canRedo]);

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
      <button
        onClick={undo}
        disabled={!canUndo}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <span className="flex items-center gap-1">
          <Undo2 size={14} /> Undo
        </span>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <span className="flex items-center gap-1">
          <Redo2 size={14} /> Redo
        </span>
      </button>

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
