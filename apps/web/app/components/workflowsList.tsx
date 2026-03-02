"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { ArrowUpRight, Search, Workflow } from "lucide-react";
import AnimatedList from "@/components/AnimatedList";

type Workflow = {
  id: string;
  name: string;
};

const fetcher = async (url: string): Promise<Workflow[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch workflows");
  }
  return res.json() as Promise<Workflow[]>;
};

export function WorkflowsList() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR("/api/workflows", fetcher);
  const normalizedQuery = search.trim().toLowerCase();

  const filteredWorkflows = useMemo(() => {
    if (!data) return [];
    if (!normalizedQuery) return data;

    return data.filter((workflow) => {
      const name = workflow.name.toLowerCase();
      const id = workflow.id.toLowerCase();
      return name.includes(normalizedQuery) || id.includes(normalizedQuery);
    });
  }, [data, normalizedQuery]);

  if (isLoading)
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value=""
            readOnly
            placeholder="Search workflows..."
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/70 pl-10 pr-3 text-sm text-zinc-300 outline-none"
          />
        </div>
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-800/40"
            />
          ))}
        </ul>
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/40 p-4 text-sm text-red-200">
        Failed to load workflows. Please refresh and try again.
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workflows..."
            className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/70 pl-10 pr-3 text-sm text-zinc-300 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
          />
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 px-6 py-12 text-center">
          <Workflow className="mb-3 text-zinc-500" size={24} />
          <p className="text-sm font-medium text-zinc-300">No workflows yet</p>
          <p className="mt-1 text-xs text-zinc-500">
            Create your first workflow to get started.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workflows..."
          className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/70 pl-10 pr-3 text-sm text-zinc-300 outline-none transition focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
        />
      </div>

      {filteredWorkflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/60 px-6 py-12 text-center">
          <Workflow className="mb-3 text-zinc-500" size={24} />
          <p className="text-sm font-medium text-zinc-300">
            No matching workflows
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try a different name or ID.
          </p>
        </div>
      ) : (
        <AnimatedList
          items={filteredWorkflows}
          className="w-full"
          itemClassName="!p-0 !bg-transparent !m-0"
          showGradients={false}
          enableArrowNavigation={false}
          displayScrollbar
          renderItem={(item) => {
            const workflow = item as Workflow;
            return (
              <Link
                href={`/editor/${workflow.id}`}
                className="group flex h-20 items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-4 transition hover:border-zinc-600 hover:bg-zinc-800/80"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {workflow.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-500">
                    ID: {workflow.id.slice(0, 12)}...
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-zinc-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-200"
                />
              </Link>
            );
          }}
        />
      )}
    </div>
  );
}
