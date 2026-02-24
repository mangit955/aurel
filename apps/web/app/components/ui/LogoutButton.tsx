"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
    >
      Logout
    </button>
  );
}
