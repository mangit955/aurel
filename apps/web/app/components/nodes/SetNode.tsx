import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";
import CurlyBrackets from "@/public/curly";

export function SetNode({ id, data }: any) {
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
    <BaseNode className={`group relative bg-zinc-800 border-zinc-200 ${color}`}>
      <div className="flex justify-between items-center text-purple-800 font-semibold">
        <span>
          <CurlyBrackets size={24} />
        </span>
        <button
          onClick={handleDelete}
          className="absolute cursor-pointer right-1 top-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300"
        >
          ✕
        </button>
      </div>
      <div className="text-xs pt-2 text-zinc-200">
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
