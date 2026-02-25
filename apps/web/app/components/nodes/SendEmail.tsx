import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function EmailNode({ data }: any) {
  return (
    <BaseNode className="bg-red-100 border-red-300">
      <div className="text-red-800 font-semibold">
        {data.label || "📧 Send Email"}
      </div>
      <div className="text-xs text-red-700 truncate">
        {data.to || "No recipient"}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="bg-red-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sent"
        className="bg-red-600"
      />
    </BaseNode>
  );
}
