"use client";

import { useEffect, useState } from "react";
import { PulsatingButton } from "@/app/components/ui/pulsating-button";

type TerminalProps = {
  onCreateWorkflow?: (name: string) => Promise<void> | void;
  isCreating?: boolean;
};

export default function Terminal({
  onCreateWorkflow,
  isCreating: isCreatingProp,
}: TerminalProps) {
  const [command, setCommand] = useState("");
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const [localIsCreating, setLocalIsCreating] = useState(false);
  const [terminalError, setTerminalError] = useState<string | null>(null);
  const [theme, setTheme] = useState<{ theme: "dark" | "light" }>({
    theme: "dark",
  });

  const isCreating = isCreatingProp ?? localIsCreating;

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme({ theme: isDark ? "dark" : "light" });
  }, []);

  const handleCreateWorkflow = async () => {
    const name = command.trim();
    if (!name) {
      setTerminalError("Enter a workflow name first.");
      return;
    }

    setTerminalError(null);

    if (isCreatingProp === undefined) {
      setLocalIsCreating(true);
    }

    try {
      if (onCreateWorkflow) {
        await onCreateWorkflow(name);
      }
      setCommand("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create workflow.";
      setTerminalError(message);
    } finally {
      if (isCreatingProp === undefined) {
        setLocalIsCreating(false);
      }
    }
  };

  return (
    <div className="mt-10 w-full max-w-2xl">
      <div className="relative overflow-hidden rounded-xl border border-zinc-700/50  shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-zinc-700/50   backdrop-blur-md px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-sm text-zinc-400">
              &gt;_ aurel.dev
            </span>
          </div>
          {isCreating ? (
            <span className="font-mono text-xs text-zinc-500">creating</span>
          ) : isTerminalFocused ? (
            <div className="flex items-center gap-2">
              <PulsatingButton
                aria-label="Live status"
                pulseColor="#22c55e"
                duration="1.5s"
                className="h-2 w-2 rounded-full bg-emerald-500 p-0 text-transparent shadow-none pointer-events-none"
              >
                .
              </PulsatingButton>
              <span className="font-mono text-xs text-muted-foreground">
                active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                aria-label="Idle status"
                className="h-2 w-2 rounded-full bg-zinc-500"
              />
              <span className="font-mono text-xs text-muted-foreground">
                idle
              </span>
            </div>
          )}
        </div>

        <div className="min-h-[100px] bg-zinc-900 px-6 py-5 font-mono text-lg text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">&gt;</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleCreateWorkflow();
                  }
                }}
                onFocus={() => setIsTerminalFocused(true)}
                onBlur={() => setIsTerminalFocused(false)}
                className={`w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700 ${
                  isTerminalFocused ? "caret-zinc-200" : "caret-transparent"
                }`}
                placeholder="create  a  workflow..."
              />
              {!isTerminalFocused && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-zinc-200 animate-blink"
                >
                  |
                </span>
              )}
            </div>
          </div>
          {terminalError ? (
            <p className="mt-3 text-left text-xs text-red-400">
              {terminalError}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-700/50 bg-zinc-900 px-4 py-2">
          <div className="flex items-center gap-4 font-mono text-sm text-zinc-500">
            <span className="rounded-full bg-zinc-700/60 px-3 py-1 text-zinc-400">
              ∞
            </span>
            <span>templates</span>
            <span className="text-zinc-600">|</span>
            <span>0 / 200</span>
          </div>

          <button
            type="button"
            onClick={() => void handleCreateWorkflow()}
            disabled={isCreating}
            onFocus={() => setIsTerminalFocused(true)}
            onBlur={() => setIsTerminalFocused(false)}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isTerminalFocused
                ? "border-zinc-900 bg-zinc-600 text-zinc-800 hover:bg-zinc-400 hover:border-zinc-400 hover:text-black"
                : "border-zinc-700/60 bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-300"
            }`}
          >
            <span>{isCreating ? "…" : "→"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
