import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "@aurel/db";

export default async function ExecutionsListPage() {
  const executions = await prisma.execution.findMany({
    include: { workflow: true },
    orderBy: { startedAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Executions</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className="pb-2 border-b">Workflow</th>
            <th className="pb-2 border-b">Status</th>
            <th className="pb-2 border-b">Started</th>
            <th className="pb-2 border-b">Duration</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((exec: any) => {
            const started = new Date(exec.startedAt);
            const ended = exec.endedAt ? new Date(exec.endedAt) : null;
            const duration = ended
              ? Math.round((ended.getTime() - started.getTime()) / 1000)
              : null;

            return (
              <tr key={exec.id} className="hover:bg-zinc-900">
                <td className="py-2 border-b">
                  {exec.workflow?.name || "Unknown Workflow"}
                </td>

                <td className="py-2 border-b">
                  <span
                    className={
                      exec.status === "success"
                        ? "text-green-600"
                        : exec.status === "failed"
                          ? "text-red-600"
                          : "text-gray-600"
                    }
                  >
                    {exec.status}
                  </span>
                </td>

                <td className="py-2 border-b">
                  {formatDistanceToNow(started, { addSuffix: true })}
                </td>

                <td className="py-2 border-b">
                  {duration != null ? `${duration}s` : "Running…"}
                </td>

                <td className="py-2 border-b">
                  <Link
                    href={`/executions/${exec.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
