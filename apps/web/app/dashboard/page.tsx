import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/route";
import LogoutButton from "../components/ui/LogoutButton";
import { WorkflowsList } from "../components/workflowsList";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Workflows</h1>
        <LogoutButton />
      </div>

      <WorkflowsList />

      <Link href="/dashboard/create">
        <button className="mt-4 btn btn-primary cursor-pointer border p-1 rounded-md">
          Create Workflow
        </button>
      </Link>
    </div>
  );
}
