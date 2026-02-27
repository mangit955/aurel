"use client";

import { useState } from "react";
import useSWR from "swr";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { WebhookNode } from "./nodes/Webhook";
import { HttpNode } from "./nodes/HttpRequest";
import { EmailNode } from "./nodes/SendEmail";
import { IfNode } from "./nodes/Filter";
import { SetNode } from "./nodes/SetNode";

const nodeTypes = {
  webhookTrigger: WebhookNode,
  httpRequest: HttpNode,
  setVariable: SetNode,
  ifFilter: IfNode,
  sendEmail: EmailNode,
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExecutionViewer({
  executionId,
}: {
  executionId: string;
}) {
  const { data: execution, error } = useSWR(
    `/api/executions/${executionId}`,
    fetcher,
  );
  const [selectedNode, setSelectedNode] = useState<any>(null);

  if (error) return <p>Error loading execution</p>;
  if (!execution) return <p>Loading…</p>;
  if (execution.error) return <p>Error: {execution.error}</p>;

  // decorate nodes with status and attach log info
  const decoratedNodes = execution.workflow.nodes.map((node: any) => {
    const log = execution.logs.find((l: any) => l.nodeId === node.id);

    return {
      ...node,
      data: {
        ...node.data,
        executionStatus: log?.status,
        executionInput: log?.input,
        executionOutput: log?.output,
        executionError: log?.error,
      },
    };
  });

  return (
    <div className="h-[80vh] w-full">
      <ReactFlow
        nodes={decoratedNodes}
        edges={execution.workflow.edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNode(node)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <div className="absolute right-4 top-4 p-4 bg-white shadow-lg border w-80">
          <h2 className="font-bold text-lg">{selectedNode.data.label}</h2>

          <p className="mt-2 text-sm">
            <b>Status:</b> {selectedNode.data.executionStatus}
          </p>
          <hr className="my-2" />

          <p className="text-xs">
            <b>Input:</b>{" "}
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(selectedNode.data.executionInput, null, 2)}
            </pre>
          </p>

          <p className="text-xs mt-2">
            <b>Output:</b>{" "}
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(selectedNode.data.executionOutput, null, 2)}
            </pre>
          </p>

          {selectedNode.data.executionError && (
            <>
              <p className="text-red-600 mt-2">
                <b>Error:</b> {selectedNode.data.executionError}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
