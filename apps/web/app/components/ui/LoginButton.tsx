"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-zinc-700">
          Signed in as {session.user?.email}
        </p>
        <button
          onClick={() => signOut()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="cursor-pointer rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-black"
      >
        Sign in with GitHub
      </button>{" "}
    </div>
  );
}
