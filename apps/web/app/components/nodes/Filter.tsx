import { Handle, Position } from "@xyflow/react";

export function IfNode({ data }: any) {
  // green for success, red for failed, gray for skipped
  const color =
    data.executionStatus === "failed"
      ? "bg-red-200"
      : data.executionStatus === "success"
        ? "bg-green-200"
        : "bg-gray-100";

  return (
    <div className={`p-2 rounded border shadow ${color}`}>
      <div className="font-bold text-sm">{data.label || "IF / Filter"}</div>
      <div className="text-xs text-gray-700 truncate">
        {data.field || "(field)"} {data.operator || "="} {data.value || ""}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        style={{ background: "#555" }}
      />

      {/* True output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ background: "green" }}
      />

      {/* False output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ background: "red" }}
      />
    </div>
  );
}
