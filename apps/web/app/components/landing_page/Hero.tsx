"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Dither from "@/components/Dither";
import { LoginForm } from "@/components/login-form";
import Terminal from "@/app/components/Terminal";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  CreditCardIcon,
  Home,
  Layers,
  LayoutDashboard,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      setShowLogin(false);
    }
  }, [session]);

  useEffect(() => {
    const container = heroRef.current;
    if (!container || window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const handleMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        container.style.setProperty("--parallax-x", `${relX * 110}px`);
        container.style.setProperty("--parallax-y", `${relY * 72}px`);
      });
    };

    const reset = () => {
      container.style.setProperty("--parallax-x", "0px");
      container.style.setProperty("--parallax-y", "0px");
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", reset);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

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
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden"
      style={
        {
          "--parallax-x": "0px",
          "--parallax-y": "0px",
        } as CSSProperties
      }
    >
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
        <span className="scrambled-text-demo font-m1 font-semibold !text-transparent !text-2xl leading-none bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text">
          aurel.
        </span>
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
              <div className="h-[40px] cursor-pointer rounded-md  bg-white/10 hover:bg-white/20 transition-colors px-3 text-white backdrop-blur-xl flex items-center gap-2">
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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <Layers />
                Workflow
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[44vh]">
        <div
          className="absolute left-1/2 top-[18%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-orange-200/20 blur-3xl transition-transform duration-300 ease-out"
          style={{
            transform:
              "translate3d(calc(-50% + (var(--parallax-x) * -0.12)), calc(var(--parallax-y) * -0.08), 0)",
          }}
        />
        <div
          className="absolute inset-x-[-14%] bottom-[-2%] h-[52%] bg-gradient-to-t from-zinc-950/85 via-zinc-900/60 to-transparent blur-[1px] transition-transform duration-300 ease-out"
          style={{
            clipPath:
              "polygon(0% 100%, 8% 66%, 14% 74%, 20% 56%, 26% 70%, 36% 44%, 46% 64%, 55% 40%, 64% 56%, 73% 33%, 82% 58%, 91% 43%, 100% 62%, 100% 100%)",
            transform:
              "translate3d(calc(var(--parallax-x) * -0.2), calc(var(--parallax-y) * -0.12), 0)",
          }}
        />
        <div
          className="absolute inset-x-[-10%] bottom-[-8%] h-[60%] bg-gradient-to-t from-zinc-900/95 via-zinc-800/82 to-transparent transition-transform duration-300 ease-out"
          style={{
            clipPath:
              "polygon(0% 100%, 0% 73%, 10% 58%, 18% 68%, 28% 48%, 37% 70%, 49% 35%, 58% 62%, 66% 46%, 75% 66%, 84% 41%, 92% 56%, 100% 45%, 100% 100%)",
            transform:
              "translate3d(calc(var(--parallax-x) * -0.35), calc(var(--parallax-y) * -0.24), 0)",
          }}
        />
        <div
          className="absolute inset-x-[-8%] bottom-[-15%] h-[70%] bg-gradient-to-t from-zinc-800 via-zinc-700/95 to-zinc-500/28 transition-transform duration-300 ease-out"
          style={{
            clipPath:
              "polygon(0% 100%, 0% 82%, 7% 67%, 15% 78%, 24% 54%, 33% 82%, 43% 42%, 52% 74%, 61% 50%, 72% 79%, 82% 46%, 90% 71%, 100% 58%, 100% 100%)",
            transform:
              "translate3d(calc(var(--parallax-x) * -0.55), calc(var(--parallax-y) * -0.38), 0)",
          }}
        />
        <div
          className="absolute inset-x-[-5%] bottom-[-19%] h-[74%] bg-gradient-to-t from-zinc-950 via-zinc-900/95 to-zinc-700/10 transition-transform duration-300 ease-out"
          style={{
            clipPath:
              "polygon(0% 100%, 0% 86%, 9% 72%, 18% 90%, 29% 58%, 37% 85%, 47% 53%, 58% 88%, 67% 60%, 77% 90%, 86% 66%, 93% 82%, 100% 74%, 100% 100%)",
            transform:
              "translate3d(calc(var(--parallax-x) * -0.8), calc(var(--parallax-y) * -0.52), 0)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
      </div>

      <div className="absolute  inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-5xl  font-semibold font-mono text-zinc-200">
          Build workflows without code
        </span>
        <p className="mt-4 backdrop-blur-sm rounded-md max-w-xl font-sans font-semibold text-md leading-relaxed text-zinc-400">
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
