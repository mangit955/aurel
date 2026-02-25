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
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
            </div>

            <SheetFooter className="mt-6 flex justify-between">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>

              <Button onClick={handleSave}>Save</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
