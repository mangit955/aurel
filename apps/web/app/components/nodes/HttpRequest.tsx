import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function HttpNode({ data }: any) {
  return (
    <BaseNode className="bg-yellow-100 border-yellow-300">
      <div className="text-yellow-800 font-semibold">🔗 HTTP Request</div>
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
