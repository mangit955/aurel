"use client";

import { useEffect } from "react";
import type { Edge, Node } from "@xyflow/react";
import { Toolbar } from "@/app/components/Toolbar";
import { SaveButton } from "@/app/components/canvas/SaveButton";
import { FlowCanvas } from "@/app/components/canvas/FlowCanvas";
import { useWorkflowStore } from "@/store/workflowStore";
import { NodeSettingsPanel } from "@/app/components/canvas/NodeSettingPanel";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, LayoutDashboard, LogOutIcon, UserIcon } from "lucide-react";

type EditorClientProps = {
  workflowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
};

export function EditorClient({
  workflowId,
  initialNodes,
  initialEdges,
}: EditorClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const initializeWorkflow = useWorkflowStore(
    (state) => state.initializeWorkflow,
  );
  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "User";

  useEffect(() => {
    initializeWorkflow(initialNodes, initialEdges);
  }, [initializeWorkflow, initialNodes, initialEdges]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 pb-4 pt-5 md:px-6">
      <div className="editor-topbar relative z-10 mb-4 flex items-center justify-between rounded-xl border border-zinc-800/90 bg-zinc-900/65 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <Toolbar workflowId={workflowId} />
        <div className="flex items-center gap-2">
          <SaveButton workflowId={workflowId} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-zinc-700/90 bg-zinc-900/95 shadow transition hover:-translate-y-0.5 hover:border-zinc-500 hover:shadow-zinc-900/60">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-zinc-200">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">
                {displayName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <LayoutDashboard />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/executions")}
              >
                <Activity />
                Executions
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative z-0">
        <FlowCanvas />
        <NodeSettingsPanel />
      </div>
    </div>
  );
}
