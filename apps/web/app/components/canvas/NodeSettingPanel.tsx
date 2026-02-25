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
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const [label, setLabel] = useState("");

  const node = nodes.find((n) => n.id === selectedNodeId);

  // Populate form with current data when selectedNodeId changes
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
    selectNode(null);
  };

  return (
    <Sheet
      open={selectedNodeId !== null && !!node}
      onOpenChange={(open) => {
        if (!open) {
          selectNode(null);
        }
        console.log("selectedNodeId:", selectedNodeId);
        console.log("node:", node);
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
