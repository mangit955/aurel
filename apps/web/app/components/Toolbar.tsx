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

  const addNode = () => {
    setNodes([
      ...nodes,
      createNode("default", Math.random() * 200, Math.random() * 200),
    ]);
  };

  return (
    <div className="space-x-2">
      <button className="btn" onClick={addNode}>
        Add Node
      </button>
      {/* add more buttons for different node types later */}
    </div>
  );
}
