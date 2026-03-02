"use client";

import { useWorkflowStore } from "@/store/workflowStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/app/components/ui/sheet";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { useState, useEffect } from "react";

export function NodeSettingsPanel() {
  const activeSettingsNodeId = useWorkflowStore((s) => s.activeSettingsNodeId);
  const setActiveSettingsNode = useWorkflowStore(
    (s) => s.setActiveSettingsNode,
  );
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const [label, setLabel] = useState("");

  const node = nodes.find((n) => n.id === activeSettingsNodeId);
  console.log("Active node type:", node?.type);
  console.log("Active node data:", node?.data);
  const isIfNode =
    typeof node?.type === "string" && node.type.toLowerCase().includes("if");

  // Populate form with current data when activeSettingsNodeId changes
  useEffect(() => {
    if (node) {
      setLabel(typeof node.data?.label === "string" ? node.data.label : "");
    } else {
      setLabel("");
    }
  }, [node]);

  const handleSave = () => {
    if (!node) return;
    console.log("Saving node:", node.id);
    console.log("Updated label:", label);
    updateNodeData(node.id, { label });
    setActiveSettingsNode(null);
  };

  return (
    <Sheet
      open={activeSettingsNodeId !== null && !!node}
      onOpenChange={(open) => {
        if (!open) {
          setActiveSettingsNode(null);
        }
      }}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Node Settings</SheetTitle>
        </SheetHeader>

        {node && (
          <>
            <div className="mt-4 space-y-4 px-8">
              <div>
                <Label className="mb-3 text-zinc-500" htmlFor="label">
                  Label
                </Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              {isIfNode && (
                <div className="space-y-4">
                  {/* Field */}
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="field">
                      Field
                    </Label>
                    <Input
                      id="field"
                      value={
                        typeof node.data?.field === "string"
                          ? node.data.field
                          : ""
                      }
                      onChange={(e) => {
                        console.log("Updating field:", e.target.value);
                        updateNodeData(node.id, { field: e.target.value });
                      }}
                    />
                  </div>

                  {/* Operator */}
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="operator">
                      Operator
                    </Label>
                    <select
                      id="operator"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={
                        typeof node.data?.operator === "string"
                          ? node.data?.operator
                          : ""
                      }
                      onChange={(e) => {
                        console.log("Updating operator:", e.target.value);
                        updateNodeData(node.id, { operator: e.target.value });
                      }}
                    >
                      <option value="equals">equals</option>
                      <option value="notEquals">notEquals</option>
                      <option value="greaterThan">greaterThan</option>
                      <option value="lessThan">lessThan</option>
                      <option value="contains">contains</option>
                      <option value="exists">exists</option>
                    </select>
                  </div>

                  {/* Value (only when operator is not 'exists') */}
                  {node.data?.operator !== "exists" && (
                    <div>
                      <Label className="mb-3 text-zinc-500" htmlFor="value">
                        Value
                      </Label>
                      <Input
                        id="value"
                        value={
                          typeof node.data?.value === "string"
                            ? node.data.value
                            : ""
                        }
                        onChange={(e) => {
                          console.log("Updating value:", e.target.value);
                          updateNodeData(node.id, { value: e.target.value });
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              {node.type === "webhookTrigger" && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="webhookPath">
                      Webhook Path
                    </Label>
                    <Input
                      id="webhookPath"
                      value={
                        typeof node.data?.path === "string"
                          ? node.data.path
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { path: e.target.value })
                      }
                      placeholder="e.g. user-created"
                    />
                  </div>

                  <div>
                    <Label
                      className="mb-3 text-zinc-500"
                      htmlFor="webhookMethod"
                    >
                      Method
                    </Label>
                    <select
                      id="webhookMethod"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={
                        typeof node.data?.method === "string"
                          ? node.data.method
                          : "POST"
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { method: e.target.value })
                      }
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                    </select>
                  </div>

                  <div className="text-xs text-gray-500 space-y-2">
                    <div>Endpoint:</div>

                    <div className="mt-1 break-all font-mono text-[11px] bg-gray-100 p-2 rounded">
                      {`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhook/${node.data?.path || "your-path"}`}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer hover:bg-zinc-300  hover:border-zinc-500!"
                      size="sm"
                      onClick={() => {
                        const fullUrl = `${window.location.origin}/api/webhook/${node.data?.path || "your-path"}`;
                        navigator.clipboard.writeText(fullUrl);
                      }}
                    >
                      Copy URL
                    </Button>
                  </div>
                </div>
              )}

              {node.type === "setVariable" && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="variableKey">
                      Variable Name
                    </Label>
                    <Input
                      id="variableKey"
                      value={
                        typeof node.data?.key === "string" ? node.data.key : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { key: e.target.value })
                      }
                      placeholder="e.g. userName"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be available to next nodes as {"{{key}}"}
                    </p>
                  </div>

                  <div>
                    <Label
                      className="mb-3 text-zinc-500"
                      htmlFor="variableValue"
                    >
                      Value (supports {"{{field}}"})
                    </Label>
                    <Input
                      id="variableValue"
                      value={
                        typeof node.data?.value === "string"
                          ? node.data.value
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { value: e.target.value })
                      }
                      placeholder="e.g. {{email}}"
                    />
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded font-mono break-all">
                    Preview:{" "}
                    {node.data?.key
                      ? `{{${node.data.key}}} = ${node.data?.value || "..."}`
                      : "Define a variable name to see preview"}
                  </div>
                </div>
              )}
              {node.type === "httpRequest" && (
                <div className="space-y-3">
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="url">
                      URL
                    </Label>
                    <Input
                      id="url"
                      value={
                        typeof node.data?.url === "string" ? node.data.url : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { url: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="method">
                      Method
                    </Label>
                    <select
                      id="method"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={
                        typeof node.data?.method === "string"
                          ? node.data.method
                          : "GET"
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { method: e.target.value })
                      }
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </div>
              )}
              {node.type === "sendEmail" && (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="to">
                      To
                    </Label>
                    <Input
                      id="to"
                      value={
                        typeof node.data?.to === "string" ? node.data.to : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { to: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="subject">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={
                        typeof node.data?.subject === "string"
                          ? node.data.subject
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { subject: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-3 text-zinc-500" htmlFor="body">
                      Body
                    </Label>
                    <textarea
                      id="body"
                      className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px]"
                      value={
                        typeof node.data?.body === "string"
                          ? node.data.body
                          : ""
                      }
                      onChange={(e) =>
                        updateNodeData(node.id, { body: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <SheetFooter className="mt-6 flex justify-between">
              <SheetClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </SheetClose>

              <Button onClick={handleSave} className="cursor-pointer">
                Save
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
