import { Handle, Position, useReactFlow } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function EmailNode({ id, data }: any) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };
  const color =
    data.executionStatus === "failed"
      ? "bg-red-200"
      : data.executionStatus === "success"
        ? "bg-green-200"
        : "bg-gray-100";

  return (
    <BaseNode className={`bg-red-100 border-red-300 ${color}`}>
      <div className="flex justify-between items-center text-red-800 font-semibold">
        <span>{data.label || "📧 Send Email"}</span>
        <button
          onClick={handleDelete}
          className="text-red-700 hover:text-red-900 text-xs"
        >
          ✕
        </button>
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
