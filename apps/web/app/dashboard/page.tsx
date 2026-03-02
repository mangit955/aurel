import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import { Sparkles, Workflow } from "lucide-react";

import { WorkflowsList } from "../components/workflowsList";
import { CreateWorkflowDialog } from "../components/dashboard/CreateWorkflowDialog";
import Navbar from "./Navbar";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 pb-4 text-zinc-100 md:px-10">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative mx-auto max-w-6xl pt-28">
        <div className="mb-6 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-[0_12px_50px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Your workflows
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Manage, edit, and run automations for{" "}
                {session.user?.name ?? "your workspace"}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 text-xs font-medium text-zinc-300">
                <Sparkles size={14} className="text-zinc-400" />
                Live workspace
              </div>
              <CreateWorkflowDialog />
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-zinc-800/90 bg-zinc-900/55 p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-md border border-zinc-700 bg-zinc-800/80 p-2">
              <Workflow size={16} className="text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">
                Workflow Library
              </p>
              <p className="text-xs text-zinc-500">
                Search and open any workflow quickly.
              </p>
            </div>
          </div>

          <WorkflowsList />
        </section>
      </div>
    </div>
  );
}
