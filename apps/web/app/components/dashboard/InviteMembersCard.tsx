"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PendingInvite = {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
};

type InviteMembersCardProps = {
  organizationName: string;
  canManageMembers: boolean;
  pendingInvites: PendingInvite[];
};

export function InviteMembersCard({
  organizationName,
  canManageMembers,
  pendingInvites,
}: InviteMembersCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Invite email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Failed to create invite");
        return;
      }

      setEmail("");
      setRole("MEMBER");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyInviteLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch (copyError) {
      console.error(copyError);
      alert(inviteUrl);
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-800/90 bg-zinc-900/55 p-4 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-100">Team access</p>
          <p className="mt-1 text-xs text-zinc-500">
            Invite teammates into {organizationName} and control their role.
          </p>
        </div>
        <MailPlus size={18} className="text-zinc-500" />
      </div>

      {canManageMembers ? (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 md:grid-cols-[1fr_140px_auto]">
          <Input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@example.com"
            className="border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Invite"}
          </Button>
        </form>
      ) : (
        <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-400">
          Only owners and admins can invite members.
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Pending invites
          </p>
          <span className="text-xs text-zinc-600">{pendingInvites.length}</span>
        </div>

        {pendingInvites.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 px-4 py-5 text-sm text-zinc-500">
            No outstanding invites.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {invite.email}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    {invite.role} · expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void copyInviteLink(invite.token)}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
                >
                  <Copy size={14} />
                  Copy invite link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
