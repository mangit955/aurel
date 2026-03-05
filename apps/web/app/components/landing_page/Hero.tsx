"use client";

import {
  type MouseEvent,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
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
import { Highlighter } from "@/components/ui/highlighter";
import ColorBends from "@/components/ColorBends";

export default function HeroBackground() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const [hoverBox, setHoverBox] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const handleNavItemEnter = (el: HTMLElement) => {
    const navRect = navRef.current?.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    if (!navRect) return;

    setHoverBox({
      left: rect.left - navRect.left,
      width: rect.width,
      opacity: 1,
    });
  };

  const handleNavLeave = () => {
    setHoverBox((prev) => ({ ...prev, opacity: 0 }));
  };

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
  const navItemClass =
    "relative z-10 px-2 py-1 rounded-md text-white/85 transition-all duration-300 ease-out hover:-translate-y-[1px] hover:text-[#FDEFC2] hover:drop-shadow-[0_0_10px_rgba(253,239,194,0.35)]";

  const handleSectionScroll = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dither Background */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ width: "100%", height: "100%" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(253,239,194,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_38%),linear-gradient(180deg,#0a0a0b_0%,#111113_55%,#09090b_100%)]" />
        <ColorBends
          className="opacity-100"
          colors={["#1a1d27", "#2a3248", "#4a3f2b"]}
          rotation={17}
          speed={0.2}
          scale={2.4}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.55}
          parallax={0.5}
          noise={0.1}
          transparent
          autoRotate={0}
        />
        <div className="absolute inset-0 bg-black/15" />
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
        <div
          ref={navRef}
          onMouseLeave={handleNavLeave}
          className="relative h-[36px] min-w-[320px] px-6 rounded-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg flex items-center justify-center gap-8 pointer-events-auto overflow-hidden"
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[26px] rounded-md bg-white/20 backdrop-blur-md transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: hoverBox.left,
              width: hoverBox.width,
              opacity: hoverBox.opacity,
            }}
          />

          <div className="flex font-semibold items-center gap-8 text-sm text-white">
            <Link
              href="#platform-overview"
              onClick={(event) =>
                handleSectionScroll(event, "platform-overview")
              }
              onMouseEnter={(e) => handleNavItemEnter(e.currentTarget)}
              className={navItemClass}
            >
              Features
            </Link>
            <span
              className={`${navItemClass} cursor-pointer`}
              onMouseEnter={(e) => handleNavItemEnter(e.currentTarget)}
            >
              Pricing
            </span>
            <Link
              href="/docs"
              className={navItemClass}
              onMouseEnter={(e) => handleNavItemEnter(e.currentTarget)}
            >
              Docs
            </Link>
            <Link
              href="#featured-section"
              onClick={(event) =>
                handleSectionScroll(event, "featured-section")
              }
              onMouseEnter={(e) => handleNavItemEnter(e.currentTarget)}
              className={navItemClass}
            >
              About
            </Link>
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
            className="h-[30px] px-5 cursor-pointer rounded-md border border-white/30 bg-[#FDEFC2] text-black text-sm font-semibold flex items-center justify-center hover:bg-[#F6DE8A] transition-colors"
          >
            Sign in
          </button>
        )}
      </div>

      <div className="absolute  inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-5xl  font-semibold font-mono text-zinc-200">
          Build workflows{" "}
          <Highlighter action="underline" color="#FDEFC2">
            without code.
          </Highlighter>
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
