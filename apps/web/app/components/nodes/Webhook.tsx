import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

export function WebhookNode({ id, data }: any) {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };

  const color =
    data.executionStatus === "failed"
      ? "bg-red-200"
      : data.executionStatus === "success"
        ? "bg-green-200"
        : "bg-gray-100";

  return (
    <BaseNode className={`bg-blue-100 border-blue-300 ${color}`}>
      <div className="flex justify-between items-center text-blue-800 font-semibold">
        <span>{data.label || "🚪 Webhook Trigger"}</span>
        <button
          onClick={handleDelete}
          className="text-yellow-700 hover:text-red-500 text-xs"
        >
          ✕
        </button>
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
