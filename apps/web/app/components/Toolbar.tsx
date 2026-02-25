"use client";

import { useWorkflowStore } from "@/store/workflowStore";

const createNode = (type: string, x: number, y: number) => ({
  id: crypto.randomUUID(),
  type,
  position: { x, y },
  data: { label: `${type} node` },
});

export function Toolbar() {
  const { nodes, setNodes } = useWorkflowStore();

  const addNode = (type: string) => {
    const newNode = createNode(type, Math.random() * 400, Math.random() * 400);

    setNodes([...nodes, newNode]);
  };

  return (
    <div className="space-x-2">
      <button className="btn" onClick={() => addNode("default")}>
        Add Node
      </button>
      {/* add more buttons for different node types later */}
      <button
        onClick={() => addNode("webhookTrigger")}
        className="bg-zinc-100 p-1 px-2 cursor-pointer rounded-md border"
      >
        Webhook
      </button>
      <button
        onClick={() => addNode("httpRequest")}
        className="bg-zinc-100 p-1 px-2 cursor-pointer rounded-md border"
      >
        HTTP
      </button>
      <button
        onClick={() => addNode("setVariable")}
        className="bg-zinc-100 p-1 px-2 cursor-pointer rounded-md border"
      >
        Set
      </button>
      <button
        onClick={() => addNode("ifFilter")}
        className="bg-zinc-100 p-1 px-2 cursor-pointer rounded-md border"
      >
        If / Filter
      </button>
      <button
        onClick={() => addNode("sendEmail")}
        className="bg-zinc-100 p-1 px-2 cursor-pointer rounded-md border"
      >
        Email
      </button>
    </div>
  );
}
