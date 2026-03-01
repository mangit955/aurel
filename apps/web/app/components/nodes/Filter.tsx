import { Handle, Position } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";

export function IfNode({ id, data }: any) {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };
  const statusColor =
    data.executionStatus === "failed"
      ? "border-destructive/50 bg-destructive/10"
      : data.executionStatus === "success"
        ? "border-green-400 bg-green-500/10"
        : "border-border bg-card";

  return (
    <div className={`w-48 rounded-xl border shadow-sm ${statusColor} text-sm text-card-foreground`}>
      {/* Header */}
      <div className="px-3 py-2 border-b bg-muted rounded-t-xl font-semibold text-muted-foreground flex justify-between items-center">
        <span>IF</span>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>

      {/* Condition */}
      <div className="px-3 py-2 text-card-foreground">
        <span className="font-medium">{data.field || "field"}</span>{" "}
        <span className="text-muted-foreground">{data.operator || "="}</span>{" "}
        <span className="font-medium">{data.value || "value"}</span>
      </div>

      {/* Branch Labels */}
      <div className="flex justify-between px-4 pb-2 text-xs font-medium">
        <span className="text-green-600">True</span>
        <span className="text-red-600">False</span>
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
    </div>
  );
}
