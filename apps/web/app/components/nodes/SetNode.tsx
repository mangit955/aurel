import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function SetNode({ data }: any) {
  return (
    <BaseNode className="bg-purple-100 border-purple-300">
      <div className="text-purple-800 font-semibold">
        {data.label || "📌 Set Variables"}
      </div>
      <div className="text-xs text-purple-700">
        {data.variables?.length ?? 0} variables
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="bg-purple-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="bg-purple-600"
      />
    </BaseNode>
  );
}
