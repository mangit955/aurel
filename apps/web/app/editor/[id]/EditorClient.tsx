"use client";

import { useEffect } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Toolbar } from "@/app/components/Toolbar";
import { SaveButton } from "@/app/components/canvas/SaveButton";
import { FlowCanvas } from "@/app/components/canvas/FlowCanvas";
import { useWorkflowStore } from "@/store/workflowStore";

type EditorClientProps = {
  workflowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
};

export function EditorClient({
  workflowId,
  initialNodes,
  initialEdges,
}: EditorClientProps) {
  const initializeWorkflow = useWorkflowStore((state) => state.initializeWorkflow);

  useEffect(() => {
    initializeWorkflow(initialNodes, initialEdges);
  }, [initializeWorkflow, initialNodes, initialEdges]);

  return (
    <div className="relative p-4">
      <div className="mb-4 flex items-center justify-between">
        <Toolbar />
        <SaveButton workflowId={workflowId} />
      </div>
      <FlowCanvas />
    </div>
  );
}
