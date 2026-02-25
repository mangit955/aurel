"use client";

import { Background, ReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";

export const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } =
    useWorkflowStore();
  console.log("nodes:", nodes);

  return (
    <div className="w-full h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          console.log("clicked", node.id);
          selectNode(node.id);
        }}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
};
