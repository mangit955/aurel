"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { WebhookNode } from "../nodes/Webhook";
import { HttpNode } from "../nodes/HttpRequest";
import { EmailNode } from "../nodes/SendEmail";
import { IfNode } from "../nodes/Filter";
import { SetNode } from "../nodes/SetNode";

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
    <div className="editor-flow-shell relative h-[calc(100vh-108px)] w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/70 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
      <ReactFlow
        className="editor-flow"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(event, node) => {
          setActiveSettingsNode(node.id);
        }}
        minZoom={0.35}
        maxZoom={1.7}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          className="editor-flow-dots"
          variant={BackgroundVariant.Dots}
          color="#a1a1aa"
          gap={20}
          size={1}
        />
        <MiniMap
          className="!bg-zinc-950/95 !border !border-zinc-700/80 !rounded-lg !shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          nodeColor={() => "#27272a"}
          nodeStrokeColor={() => "#71717a"}
          maskColor="rgba(9, 9, 11, 0.55)"
        />
        <Controls className="editor-flow-controls" showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
