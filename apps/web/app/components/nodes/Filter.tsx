import { Handle, Position } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import Signpost from "@/public/signpost";
import { BaseNode } from "./BaseNode";

export function IfNode({ id, data }: any) {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };
  const color =
    data.executionStatus === "failed"
      ? "border-destructive/50 bg-destructive/10"
      : data.executionStatus === "success"
        ? "border-green-400 bg-green-500/10"
        : "border-border bg-card";

  return (
    <BaseNode className={`group relative bg-zinc-900 border-zinc-400 ${color}`}>
      <div className="flex flex-col items-center relative py-2">
        <div className="text-yellow-800 font-semibold">
          <Signpost size={24} />
        </div>

        <button
          onClick={handleDelete}
          className="absolute cursor-pointer right-1 top-1 text-xs text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-300"
        >
          ✕
        </button>

        {/* Branch Labels */}
        <div className="flex gap-4 justify-between w-full px-6 pt-2 text-xs font-medium">
          <span className="text-zinc-200">True</span>
          <span className="text-zinc-200">False</span>
        </div>
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        style={{ background: "#6b7280" }}
      />

      {/* True Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{
          left: "25%",
          background: "#16a34a",
        }}
      />

      {/* False Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{
          left: "75%",
          background: "#dc2626",
        }}
      />
    </BaseNode>
  );
}
