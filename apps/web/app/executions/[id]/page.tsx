import ExecutionViewer from "@/app/components/ExecutionViewer";
import Navbar from "@/app/dashboard/Navbar";
import { Activity } from "lucide-react";

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 pb-10 text-zinc-100 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,255,255,0.04),transparent_35%)]" />
      <Navbar />

      <div className="relative mx-auto max-w-6xl pt-28">
        <section className="mb-6 rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-[0_12px_50px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400">
                Execution
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Execution Detail
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Inspect node-by-node run data and debug the workflow output.
              </p>
            </div>

            <div className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 text-xs font-medium text-zinc-300">
              <Activity size={14} className="text-zinc-400" />
              Run ID: {id.slice(0, 12)}...
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800/90 bg-zinc-900/55 p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
          <ExecutionViewer executionId={id} />
        </section>
      </div>
    </div>
  );
}
