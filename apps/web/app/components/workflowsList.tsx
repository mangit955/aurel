"use client";

import useSWR from "swr";

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
  const { data, error, isLoading } = useSWR("/api/workflows", fetcher);

  if (isLoading) return <p>Loading workflows...</p>;
  if (error) return <p>Error loading workflows</p>;
  if (!data || data.length === 0) return <p>No workflows</p>;

  return (
    <ul className="space-y-2">
      {data.map((workflow) => (
        <li key={workflow.id} className="rounded border p-3">
          {workflow.name}
        </li>
      ))}
    </ul>
  );
}
