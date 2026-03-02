import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import Gmail from "@/public/gmail";
import { useWorkflowStore } from "@/store/workflowStore";

export function EmailNode({ id, data }: any) {
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
    <BaseNode className={`group relative bg-zinc-900 border-zinc-400 ${color}`}>
      <button
        onClick={handleDelete}
        className="absolute cursor-pointer right-1 top-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300"
      >
        ✕
      </button>
      <div className="flex items-center text-zinc-200 font-semibold">
        <span>
          <Gmail size={24} className="" />
        </span>
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
