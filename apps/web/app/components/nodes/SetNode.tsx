import { Handle, Position } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { useWorkflowStore } from "@/store/workflowStore";

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
    <BaseNode className={`bg-purple-100 border-purple-300 ${color}`}>
      <div className="flex justify-between items-center text-purple-800 font-semibold">
        <span>{data.label || "📌 Set Variables"}</span>
        <button
          onClick={handleDelete}
          className="text-purple-700 hover:text-red-500 text-xs"
        >
          ✕
        </button>
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
