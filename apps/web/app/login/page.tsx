import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthButton } from "../components/ui/LoginButton";
import { auth } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in to access your workflows dashboard.
        </p>

        <div className="mt-6">
          <AuthButton />
        </div>

        <Link href="/" className="mt-6 inline-block text-sm text-zinc-500 underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
