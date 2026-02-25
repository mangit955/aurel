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
      <button onClick={() => addNode("webhookTrigger")}>Webhook</button>
      <button onClick={() => addNode("httpRequest")}>HTTP</button>
      <button onClick={() => addNode("setVariables")}>Set</button>
      <button onClick={() => addNode("ifFilter")}>If</button>
      <button onClick={() => addNode("sendEmail")}>Email</button>
    </div>
  );
}
