import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function HttpNode({ data }: any) {
  const color =
    data.executionStatus === "failed"
      ? "bg-red-200"
      : data.executionStatus === "success"
        ? "bg-green-200"
        : "bg-gray-100";

  return (
    <BaseNode className={`bg-yellow-100 border-yellow-300 ${color}`}>
      <div className="text-yellow-800 font-semibold">
        {data.label || "🔗 HTTP Request"}
      </div>
      <div className="text-xs text-yellow-700 truncate">
        {data.method || "GET"} {data.url || ""}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="bg-yellow-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="bg-yellow-600"
      />
    </BaseNode>
  );
}
