import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import LogoutButton from "../components/ui/LogoutButton";

type Workflow = {
  id: string;
  name: string;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const headerStore = await headers();
  const host = headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "";

  const response = await fetch(`${baseUrl}/api/workflows`, {
    cache: "no-store",
  });
  const workflows: Workflow[] = response.ok ? await response.json() : [];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Workflows</h1>
        <LogoutButton />
      </div>

      <ul className="space-y-2">
        {workflows.map((workflow) => (
          <li key={workflow.id} className="rounded border p-3">
            {workflow.name}
          </li>
        ))}
      </ul>

      <Link href="/dashboard/create">
        <button className="mt-4 btn btn-primary cursor-pointer border p-1 rounded-md">
          Create Workflow
        </button>
      </Link>
    </div>
  );
}
