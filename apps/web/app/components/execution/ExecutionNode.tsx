"use client";

import { useState } from "react";
import { Handle, Position } from "@xyflow/react";

export default function ExecutionNode({ data }: any) {
  const [expanded, setExpanded] = useState(false);

  const status = data.executionStatus;
  const bgColor =
    status === "success"
      ? "bg-green-200/60"
      : status === "failed"
        ? "bg-red-200"
        : "bg-gray-100";

  return (
    <div
      className={`p-2 border rounded shadow cursor-pointer ${bgColor}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="font-bold text-sm">{data.label}</div>

      {expanded && (
        <div className="mt-2 text-xs space-y-1">
          <div>
            <b>Input:</b>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(data.executionInput, null, 2)}
            </pre>
          </div>

          {data.executionOutput && (
            <div>
              <b>Output:</b>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(data.executionOutput, null, 2)}
              </pre>
            </div>
          )}

          {data.executionError && (
            <div className="text-red-600">
              <b>Error:</b> {data.executionError}
            </div>
          )}
        </div>
      )}

      {/* React Flow handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
