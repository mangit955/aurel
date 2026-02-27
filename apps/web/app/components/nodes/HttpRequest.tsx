import { Handle, Position, useReactFlow } from "@xyflow/react";
import { BaseNode } from "./BaseNode";

export function HttpNode({ id, data }: any) {
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
    <BaseNode className={`bg-yellow-100 border-yellow-300 ${color}`}>
      <div className="flex justify-between items-center text-yellow-800 font-semibold">
        <span>{data.label || "🔗 HTTP Request"}</span>
        <button
          onClick={handleDelete}
          className="text-yellow-700 hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>
      <div className="text-xs text-yellow-700 truncate">
        {data.method || "GET"} {data.url || ""}
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
