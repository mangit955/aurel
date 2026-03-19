"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const payload = (await response.json().catch(() => null)) as
    | {
        error?: string;
        email?: string;
        role?: string;
        acceptedAt?: string | null;
        expiresAt?: string;
        organization?: { id: string; name: string };
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error ?? "Failed to load invite");
  }

  return payload;
};

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const {
    data: invite,
    error: inviteError,
    isLoading: isInviteLoading,
  } = useSWR(`/api/invites/accept/${params.token}`, fetcher);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const signedInEmail = session?.user?.email?.toLowerCase() ?? null;
  const invitedEmail = invite?.email?.toLowerCase() ?? null;
  const isMatchingAccount =
    signedInEmail && invitedEmail ? signedInEmail === invitedEmail : false;

  const acceptInvite = async () => {
    setStatus("submitting");
    setError(null);

    const response = await fetch(`/api/invites/accept/${params.token}`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus("error");
      setError(payload?.error ?? "Failed to accept invite");
      return;
    }

    setStatus("success");
    router.push("/dashboard");
    router.refresh();
  };

  const handleSignIn = async (provider: "google" | "github") => {
    if (loadingProvider) {
      return;
    }

    setLoadingProvider(provider);
    try {
      await signIn(provider, {
        callbackUrl: window.location.href,
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut({
      callbackUrl: window.location.href,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-500">
          Workspace Invite
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Join organization</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Accept this invite with your current account to join the shared workspace.
        </p>

        {isInviteLoading ? (
          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-400">
            Loading invite...
          </div>
        ) : null}

        {inviteError ? (
          <div className="mt-5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-200">
            {inviteError.message}
          </div>
        ) : null}

        {invite?.organization ? (
          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
            <p className="font-medium text-zinc-100">{invite.organization.name}</p>
            <p className="mt-1 text-zinc-500">
              Invited email: {invite.email}
              {invite.role ? ` · role ${invite.role.toLowerCase()}` : ""}
            </p>
          </div>
        ) : null}

        {sessionStatus === "loading" ? (
          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-400">
            Checking your account...
          </div>
        ) : null}

        {sessionStatus === "unauthenticated" ? (
          <div className="mt-5 rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p>Sign in with {invite?.email ?? "the invited email"} to accept this invite.</p>
            <div className="mt-4 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center border-white/15 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                disabled={loadingProvider !== null}
                onClick={() => void handleSignIn("github")}
              >
                {loadingProvider === "github" ? (
                  <Spinner width={18} height={18} />
                ) : (
                  <>
                    <Github fill="white" />
                    Continue with GitHub
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center border-white/15 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                disabled={loadingProvider !== null}
                onClick={() => void handleSignIn("google")}
              >
                {loadingProvider === "google" ? (
                  <Spinner width={18} height={18} />
                ) : (
                  <>
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={18}
                      height={18}
                    />
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}

        {sessionStatus === "authenticated" && invite?.email && !isMatchingAccount ? (
          <div className="mt-5 rounded-lg border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-100">
            <p>
              You are signed in as {session?.user?.email}. This invite was sent to{" "}
              {invite.email}.
            </p>
            <Button onClick={() => void handleSwitchAccount()} className="mt-4 w-full">
              Switch account
            </Button>
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {status === "success" ? (
          <div className="mt-5 rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-3 text-sm text-emerald-200">
            Invite accepted. Redirecting to the dashboard.
          </div>
        ) : null}

        <Button
          onClick={() => void acceptInvite()}
          disabled={
            status === "submitting" ||
            status === "success" ||
            sessionStatus !== "authenticated" ||
            !isMatchingAccount
          }
          className="mt-6 w-full"
        >
          {status === "submitting" ? "Accepting..." : "Accept invite"}
        </Button>
      </div>
    </div>
  );
}
