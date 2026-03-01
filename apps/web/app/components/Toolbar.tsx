"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import {
  ChevronDown,
  Filter,
  Globe,
  Mail,
  Redo2,
  Undo2,
  Variable,
  Webhook,
} from "lucide-react";
import Flask from "@/public/flask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border flex items-center gap-1">
            Add Node <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addNode("webhookTrigger")}
          >
            Webhook
            <Webhook size={14} className="ml-auto text-zinc-500" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addNode("httpRequest")}
          >
            HTTP
            <Globe size={14} className="ml-auto text-zinc-500" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addNode("setVariable")}
          >
            Set
            <Variable size={14} className="ml-auto text-zinc-500" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addNode("ifFilter")}
          >
            If / Filter
            <Filter size={14} className="ml-auto text-zinc-500" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => addNode("sendEmail")}
          >
            Email
            <Mail size={14} className="ml-auto text-zinc-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={undo}
        disabled={!canUndo}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <span className="flex items-center gap-1">
          <Undo2 size={14} />
        </span>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="bg-secondary text-secondary-foreground p-1 px-2 cursor-pointer rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <span className="flex items-center gap-1">
          <Redo2 size={14} />
        </span>
      </button>

      {workflowId && (
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-orange-400 gap-2 flex items-center font-semibold text-white p-1 px-2 cursor-pointer rounded-md disabled:opacity-50"
        >
          <Flask size={20} />
          {isRunning ? "Running..." : "Run Workflow"}
        </button>
      )}
    </div>
  );
}
