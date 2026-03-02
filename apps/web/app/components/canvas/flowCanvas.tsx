"use client";

import { Background, ReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { WebhookNode } from "../nodes/Webhook";
import { HttpNode } from "../nodes/HttpRequest";
import { EmailNode } from "../nodes/SendEmail";
import { IfNode } from "../nodes/Filter";
import { SetNode } from "../nodes/SetNode";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, LayoutDashboard, LogOutIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const nodeTypes = {
  webhookTrigger: WebhookNode,
  httpRequest: HttpNode,
  setVariable: SetNode,
  ifFilter: IfNode,
  sendEmail: EmailNode,
};

export const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowStore();
  const router = useRouter();
  const { data: session } = useSession();
  const setActiveSettingsNode = useWorkflowStore(
    (s) => s.setActiveSettingsNode,
  );

  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(event, node) => {
          setActiveSettingsNode(node.id);
        }}
        fitView
      >
        <Background />
      </ReactFlow>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="pointer-events-auto cursor-pointer flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 shadow-lg transition hover:-translate-y-0.5 hover:border-zinc-500 hover:shadow-zinc-900/60">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-200">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="mb-2 w-52">
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
  );
};
