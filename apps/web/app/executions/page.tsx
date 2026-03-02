import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@aurel/db";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import Navbar from "../dashboard/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PulsatingButton } from "../components/ui/pulsating-button";
import ShinyText from "@/components/ShinyText";

const statusStyles: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  failed: "bg-red-500/15 text-red-300 border border-red-500/30",
  running: "bg-amber-500/15 text-amber-200 border border-amber-500/30",
};

export default async function ExecutionsListPage() {
  const [totalExecutions, successCount, failedCount, runningCount, executions] =
    await Promise.all([
      prisma.execution.count(),
      prisma.execution.count({ where: { status: "success" } }),
      prisma.execution.count({ where: { status: "failed" } }),
      prisma.execution.count({ where: { status: "running" } }),
      prisma.execution.findMany({
        include: { workflow: true },
        orderBy: { startedAt: "desc" },
      }),
    ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-6 pb-10 text-zinc-100 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,255,255,0.04),transparent_35%)]" />
      <Navbar />

      <div className="relative mx-auto max-w-6xl pt-28">
        <section className="mb-6 rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-5 shadow-[0_12px_50px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <ShinyText
                text="Monitoring"
                speed={2}
                delay={0}
                spread={105}
                color="#9f9fa9"
                shineColor="#ffffff"
                className="text-xs font-mono uppercase tracking-[0.22em]"
              />
              <h1 className="mt-2 text-3xl  font-semibold tracking-tight md:text-4xl">
                Executions
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Track every workflow run, status, and timing in one place.
              </p>
            </div>
            <div className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800/90 px-3 text-xs font-medium text-zinc-200">
              <PulsatingButton
                aria-label="Live status"
                pulseColor="#22c55e"
                duration="1.5s"
                className="h-2 w-2 rounded-full bg-emerald-500 p-0 text-transparent shadow-none pointer-events-none"
              >
                .
              </PulsatingButton>
              Live activity
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle2 size={14} className="text-emerald-300" />
              Success
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {successCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <XCircle size={14} className="text-red-300" />
              Failed
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {failedCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock3 size={14} className="text-amber-200" />
              Running...
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">
              {runningCount}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800/90 bg-zinc-900/55 p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60">
            <div className="border-b border-zinc-800 px-4 py-2 text-xs text-zinc-500">
              Total executions: {totalExecutions}
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0 z-10 border-zinc-800/80 bg-zinc-950/95 hover:bg-zinc-950/95">
                    <TableHead className="text-zinc-400">Workflow</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Started</TableHead>
                    <TableHead className="text-zinc-400">Duration</TableHead>
                    <TableHead className="text-right text-zinc-400">
                      Open
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.length === 0 ? (
                    <TableRow className="border-zinc-800/80 hover:bg-transparent">
                      <TableCell
                        colSpan={5}
                        className="py-12 text-center text-sm text-zinc-500"
                      >
                        No executions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    executions.map((exec: any) => {
                      const started = new Date(exec.startedAt);
                      const ended = exec.endedAt
                        ? new Date(exec.endedAt)
                        : null;
                      const duration = ended
                        ? Math.round(
                            (ended.getTime() - started.getTime()) / 1000,
                          )
                        : null;
                      const normalizedStatus = String(
                        exec.status,
                      ).toLowerCase();
                      const badgeClass =
                        statusStyles[normalizedStatus] ??
                        "bg-zinc-700/40 text-zinc-300 border border-zinc-600/40";

                      return (
                        <TableRow
                          key={exec.id}
                          className="border-zinc-800/80 transition hover:bg-zinc-900/60"
                        >
                          <TableCell className="py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-zinc-100">
                                {exec.workflow?.name || "Unknown Workflow"}
                              </p>
                              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                                {exec.id.slice(0, 12)}...
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${badgeClass}`}
                            >
                              {normalizedStatus}
                            </span>
                          </TableCell>

                          <TableCell className="py-3 text-sm text-zinc-300">
                            {formatDistanceToNow(started, { addSuffix: true })}
                          </TableCell>

                          <TableCell className="py-3 text-sm text-zinc-300">
                            {duration != null ? `${duration}s` : "Running..."}
                          </TableCell>

                          <TableCell className="py-3 text-right">
                            <Link
                              href={`/executions/${exec.id}`}
                              className="group relative inline-flex items-center gap-1 text-sm text-zinc-300 transition hover:text-white"
                            >
                              View
                              <ArrowRight className="-rotate-45 text-muted-foreground h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-0" />
                              <span className="pointer-events-none absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
