import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function IfNode({ data }: any) {
  return (
    <BaseNode className="bg-green-100 border-green-300">
      <div className="text-green-800 font-semibold">
        {data.label || "🔎 If / Filter"}
      </div>
      <div className="text-xs text-green-700 truncate">
        {data.field || ""} {data.operator || ""} {data.value || ""}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="bg-green-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="bg-green-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="bg-green-600"
      />
    </BaseNode>
  );
}
