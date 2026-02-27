import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function WebhookNode({ data }: any) {
  const color =
    data.executionStatus === "failed"
      ? "bg-red-200"
      : data.executionStatus === "success"
        ? "bg-green-200"
        : "bg-gray-100";

  return (
    <BaseNode className={`bg-blue-100 border-blue-300 ${color}`}>
      <div className="text-blue-800 font-semibold">
        {data.label || "🚪 Webhook Trigger"}
      </div>
      <div className="text-xs text-blue-700 truncate">
        {data.webhookUrl || "No URL set"}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="bg-blue-600"
      />
    </BaseNode>
  );
}
