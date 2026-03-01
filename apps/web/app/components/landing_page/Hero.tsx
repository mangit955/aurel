"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dither from "@/components/Dither";
import GradientText from "@/components/GradientText";
import { LoginForm } from "@/components/login-form";
import ScrambledText from "@/components/ScrambledText";
import Terminal from "@/app/components/Terminal";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CreditCardIcon, Home, LogOutIcon, SettingsIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/public/icon";

export default function HeroBackground() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setShowLogin(false);
    }
  }, [session]);

  const handleCreateWorkflow = async (name: string) => {
    if (!name) {
      throw new Error("Enter a workflow name first.");
    }
    setIsCreatingWorkflow(true);

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (response.status === 401) {
          setShowLogin(true);
        }

        throw new Error(payload?.error ?? "Failed to create workflow.");
      }

      const workflow = (await response.json()) as { id: string };
      router.push(`/editor/${workflow.id}`);
      router.refresh();
    } finally {
      setIsCreatingWorkflow(false);
    }
  };

  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dither Background */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ width: "100%", height: "100%" }}
      >
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={[0.22, 0.22, 0.22]}
          colorNum={4}
          pixelSize={2}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.25}
        />
      </div>

      {/* Logo aligned left */}
      <div className="absolute top-6 left-8 z-10 h-[48px] flex items-center gap-2">
        <Icon size={36} />
        <ScrambledText
          className="scrambled-text-demo font-semibold font-mono! text-white !text-2xl leading-none"
          radius={30}
          duration={1.2}
          speed={0.5}
          scrambleChars=":."
        >
          aurel.
        </ScrambledText>
      </div>

      {/* Glassmorphism Navbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="h-[36px] min-w-[320px] px-6 rounded-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg flex items-center justify-center gap-8 pointer-events-auto">
          <div className="flex font-semibold items-center gap-8 text-sm text-white">
            <span>Features</span>
            <span>Pricing</span>
            <span>Docs</span>
            <span>About</span>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-8 z-10 flex items-center gap-3">
        <Link
          href="/"
          className="h-[30px] px-1 rounded-md border border-white/25 bg-white/10 text-white text-sm font-medium backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Home height={20} width={20} />
        </Link>
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-[40px] cursor-pointer rounded-full  bg-white/10 hover:bg-white/20 transition-colors px-3 text-white backdrop-blur-xl flex items-center gap-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={displayName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-7 w-7 rounded-full bg-zinc-700 text-zinc-100 text-xs font-semibold flex items-center justify-center">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[140px] truncate text-sm font-medium">
                  {displayName}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            onClick={() => setShowLogin(true)}
            className="h-[30px] px-5 cursor-pointer rounded-md border border-white/30 bg-white text-black text-sm font-semibold flex items-center justify-center hover:bg-zinc-200 transition-colors"
          >
            Sign in
          </button>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-5xl font-semibold font-mono text-zinc-200">
          Build workflows without code
        </span>
        <p className="mt-4 max-w-xl font-sans font-semibold text-md leading-relaxed text-zinc-300">
          Automate your backend logic visually. Triggers, actions, and branching
          — all in one powerful canvas.
        </p>
        <Terminal
          onCreateWorkflow={handleCreateWorkflow}
          isCreating={isCreatingWorkflow}
        />
      </div>

      {showLogin && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-6">
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setShowLogin(false)}
            aria-label="Close sign in modal"
          />
          <div className="relative w-full max-w-sm md:max-w-4xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-md bg-black/70 px-3 py-1 text-sm text-white hover:bg-black/85"
              onClick={() => setShowLogin(false)}
            >
              Close
            </button>
            <LoginForm className="relative z-0" />
          </div>
        </div>
      )}
    </div>
  );
}
