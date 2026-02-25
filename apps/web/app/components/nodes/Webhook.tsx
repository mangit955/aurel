import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function WebhookNode({ data }: any) {
  return (
    <BaseNode className="bg-blue-100 border-blue-300">
      <div className="text-blue-800 font-semibold">🚪 Webhook Trigger</div>
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
