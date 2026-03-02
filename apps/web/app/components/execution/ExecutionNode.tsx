"use client";

import { Handle, Position } from "@xyflow/react";
import { Braces, Globe, Mail, Signpost, Webhook } from "lucide-react";

export default function ExecutionNode({ data }: any) {
  const label = String(data?.label ?? "Node");
  const normalizedLabel = label.toLowerCase();
  const status = String(data?.executionStatus ?? "pending").toLowerCase();

  const statusTone =
    status === "success"
      ? "border-emerald-500/40 bg-emerald-500/10"
      : status === "failed"
        ? "border-red-500/40 bg-red-500/10"
        : "border-zinc-700 bg-zinc-900/90";

  const statusTextClass =
    status === "success"
      ? "text-emerald-300"
      : status === "failed"
        ? "text-red-300"
        : "text-zinc-400";

  const Icon = normalizedLabel.includes("webhook")
    ? Webhook
    : normalizedLabel.includes("http")
      ? Globe
      : normalizedLabel.includes("email")
        ? Mail
        : normalizedLabel.includes("if")
          ? Signpost
          : Braces;

  return (
    <div
      className={`min-w-[176px] backdrop-blur-sm rounded-sm border px-3 py-2 shadow-md ${statusTone}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200">
          <Icon size={16} />
          <span className="max-w-[110px] truncate text-sm font-semibold">
            {label}
          </span>
        </div>
        <span
          className={`text-[10px] font-medium capitalize ${statusTextClass}`}
        >
          {status}
        </span>
      </div>

      <p className="truncate text-[11px] text-zinc-400">
        {status === "failed"
          ? data?.executionError || "Execution failed"
          : status === "success"
            ? "Execution completed"
            : "Waiting for execution"}
      </p>

      <Handle
        type="target"
        position={Position.Top}
        id="input"
        className="!h-2.5 !w-2.5 !border !border-zinc-900 !bg-zinc-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        className="!h-2.5 !w-2.5 !border !border-zinc-900 !bg-zinc-500"
      />
    </div>
  );
}
