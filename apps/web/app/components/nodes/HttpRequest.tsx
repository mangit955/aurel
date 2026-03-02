import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import Globe from "@/public/globe";

export function HttpNode({ id, data }: any) {
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
      <div className="flex justify-between items-center text-yellow-800 font-semibold">
        <span>
          <Globe size={24} className="text-blue-400" />
        </span>
        <button
          onClick={handleDelete}
          className="absolute cursor-pointer right-1 top-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300"
        >
          ✕
        </button>
      </div>
      <div className="text-xs pt-2 text-zinc-200 truncate">
        {data.method || "GET"}
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
