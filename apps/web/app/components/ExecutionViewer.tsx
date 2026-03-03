"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { X } from "lucide-react";
import ExecutionNode from "./execution/ExecutionNode";

const nodeTypes = {
  executionNode: ExecutionNode,
};

const getMiniMapNodeColor = (node: any) => {
  const status = String(node?.data?.executionStatus ?? "").toLowerCase();
  if (status === "success") return "#10b981";
  if (status === "failed") return "#ef4444";
  if (status === "running") return "#f59e0b";
  return "#52525b";
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error("API Error Text:", text);
    throw new Error(`API returned ${res.status}`);
  }
  return res.json();
};

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

  if (error)
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-200">
        Failed to load execution. Please refresh and try again.
      </div>
    );
  if (!execution)
    return (
      <div className="h-[70vh] w-full animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/50" />
    );
  if (execution.error)
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-200">
        Error: {execution.error}
      </div>
    );

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
        label: node.data.label, // preserve label
      },
    };
  });

  const status = String(selectedNode?.data?.executionStatus ?? "").toLowerCase();
  const statusClass =
    status === "success"
      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
      : status === "failed"
        ? "bg-red-500/15 text-red-300 border border-red-500/30"
        : "bg-amber-500/15 text-amber-200 border border-amber-500/30";

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/70">
      <ReactFlow
        className="editor-flow"
        nodes={decoratedNodes.map((n: any) => ({
          ...n,
          type: "executionNode",
        }))}
        edges={execution.workflow.edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNode(node)}
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
          size={2}
        />
        <MiniMap
          className="!bg-zinc-950/95 !border !border-zinc-700/80 !rounded-lg !shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          position="top-right"
          bgColor="rgba(9, 9, 11, 0.95)"
          nodeColor={getMiniMapNodeColor}
          nodeStrokeColor={() => "#e4e4e7"}
          nodeStrokeWidth={1.2}
          nodeBorderRadius={3}
          maskColor="rgba(9, 9, 11, 0.58)"
          maskStrokeColor="#d4d4d8"
          maskStrokeWidth={1.2}
          pannable
          zoomable
          ariaLabel="Execution minimap"
        />
        <Controls className="editor-flow-controls" showInteractive={false} />
      </ReactFlow>
      {selectedNode && (
        <div className="absolute right-4 top-4 z-20 w-[22rem] rounded-xl border border-zinc-700 bg-zinc-900/95 p-4 text-zinc-100 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{selectedNode.data.label}</h2>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
              >
                {status || "unknown"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="mb-1 font-medium text-zinc-400">Input</p>
              <pre className="max-h-28 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-2 whitespace-pre-wrap text-[11px] text-zinc-300">
                {JSON.stringify(selectedNode.data.executionInput, null, 2)}
              </pre>
            </div>

            <div>
              <p className="mb-1 font-medium text-zinc-400">Output</p>
              <pre className="max-h-28 overflow-auto rounded-md border border-zinc-800 bg-zinc-950 p-2 whitespace-pre-wrap text-[11px] text-zinc-300">
                {JSON.stringify(selectedNode.data.executionOutput, null, 2)}
              </pre>
            </div>
          </div>

          {selectedNode.data.executionError && (
            <div className="mt-3 rounded-md border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-200">
              <b>Error:</b> {selectedNode.data.executionError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
