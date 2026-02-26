import { Handle, Position } from "@xyflow/react";

export function IfNode({ data }: any) {
  return (
    <div className="p-2 bg-green-100 rounded shadow border w-40">
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
