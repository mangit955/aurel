import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import Webhook from "@/public/webhook";

export function WebhookNode({ id, data }: any) {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };

  const color =
    data.executionStatus === "failed"
      ? "border-red-400/60 bg-red-500/10"
      : data.executionStatus === "success"
        ? "border-emerald-400/60 bg-emerald-500/10"
        : "border-zinc-700/90 bg-zinc-900/95";

  return (
    <BaseNode className={`group relative ${color}`}>
      <div className="flex items-center justify-between font-semibold text-zinc-100">
        <span>
          <Webhook fill="white" size={24} />
        </span>
        <button
          onClick={handleDelete}
          className="absolute cursor-pointer right-1 top-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300"
        >
          ✕
        </button>
      </div>
      <div className="truncate pt-2 text-xs text-zinc-300">
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
