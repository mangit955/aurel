import Link from "next/link";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    body: "Aurel lets you design backend workflows visually. You combine trigger nodes, action nodes, and branching logic, then execute and monitor each run from one place.",
    points: [
      "Create a workflow from the home terminal or dashboard.",
      "Add a trigger node (for example webhook).",
      "Chain action nodes (HTTP request, email, set values).",
      "Use filter/branch nodes to route true vs false outcomes.",
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    body: "Every workflow run is deterministic based on node inputs and previous outputs. Keep node configs small, explicit, and testable.",
    points: [
      "Workflow: a graph of connected nodes.",
      "Execution: one run instance of that workflow.",
      "Node output: data produced by a node for downstream steps.",
      "Branching: conditional path selection from filter logic.",
    ],
  },
  {
    id: "nodes",
    title: "Node Types",
    body: "Build most automations using a small set of composable nodes.",
    points: [
      "Webhook: starts a run from external systems.",
      "HTTP Request: calls APIs with request configuration.",
      "Set: transforms and stores intermediate values.",
      "Filter: applies conditions to split execution paths.",
      "Send Email: sends notifications from run outcomes.",
    ],
  },
  {
    id: "executions",
    title: "Executions & Monitoring",
    body: "Use the executions view to debug failures and verify expected outcomes.",
    points: [
      "Inspect run status and timestamps.",
      "Review per-node outputs and errors.",
      "Track branch decisions for auditability.",
      "Re-run workflows after config changes.",
    ],
  },
  {
    id: "webhooks-api",
    title: "Webhooks & API",
    body: "Webhook endpoints trigger workflows directly. You can also create workflows programmatically from API routes.",
    points: [
      "Use workflow webhook URLs for inbound event triggers.",
      "Keep webhook secret values private.",
      "Validate incoming payloads before branching.",
      "Prefer idempotent downstream actions where possible.",
    ],
  },
  {
    id: "best-practices",
    title: "Best Practices",
    body: "These patterns improve reliability as workflows scale.",
    points: [
      "Name workflows and nodes with domain language.",
      "Keep each node focused on one responsibility.",
      "Surface terminal errors with actionable messages.",
      "Add branch guards before expensive or external operations.",
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    body: "If a workflow fails, isolate where input, transform, or action diverged.",
    points: [
      "No run triggered: verify webhook route and secret.",
      "Branch mismatch: inspect filter conditions and input shapes.",
      "Action failed: inspect HTTP response and auth headers.",
      "Missing data: confirm upstream node outputs and mapping keys.",
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              Aurel Documentation
            </p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
              Build Reliable Workflow Automation
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-10 md:grid-cols-[260px_1fr] md:px-10">
        <aside className="md:sticky md:top-6 md:h-fit">
          <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
              On This Page
            </p>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <section className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="scroll-mt-8 rounded-2xl border border-white/10 bg-zinc-900/45 p-6 md:p-7"
            >
              <h2 className="text-xl font-semibold text-zinc-100 md:text-2xl">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300 md:text-base">
                {section.body}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300 md:text-base">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[7px] inline-block h-1.5 w-1.5 rounded-full bg-[#FDEFC2]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
