"use client";

import { Background, ReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { WebhookNode } from "../nodes/Webhook";
import { HttpNode } from "../nodes/HttpRequest";
import { EmailNode } from "../nodes/SendEmail";
import { IfNode } from "../nodes/Filter";
import { SetNode } from "../nodes/SetVariable";

const nodeTypes = {
  webhookTrigger: WebhookNode,
  httpRequest: HttpNode,
  setVariable: SetNode,
  ifFilter: IfNode,
  sendEmail: EmailNode,
};

export const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowStore();
  const setActiveSettingsNode = useWorkflowStore(
    (s) => s.setActiveSettingsNode,
  );

  return (
    <div className="w-full h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(event, node) => {
          setActiveSettingsNode(node.id);
        }}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
};
