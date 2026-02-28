"use client";

import { useState } from "react";
import Dither from "@/components/Dither";
import GradientText from "@/components/GradientText";
import { LoginForm } from "@/components/login-form";
import ScrambledText from "@/components/ScrambledText";
import Link from "next/link";

export default function HeroBackground() {
  const [showLogin, setShowLogin] = useState(false);
  const [command, setCommand] = useState("");
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);

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
      <div className="absolute top-6 left-8 z-10 h-[48px] flex items-center">
        <ScrambledText
          className="scrambled-text-demo text-white font-semibold text-lg"
          radius={30}
          duration={1.2}
          speed={0.5}
          scrambleChars=":."
        >
          Aurel.
        </ScrambledText>
      </div>

      {/* Glassmorphism Navbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="h-[48px] min-w-[320px] px-6 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg flex items-center justify-center gap-8 pointer-events-auto">
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
          className="h-[40px] px-5 rounded-full border border-white/25 bg-white/10 text-white text-sm font-medium backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          Home
        </Link>
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="h-[40px] px-5 rounded-full border border-white/30 bg-white text-black text-sm font-semibold flex items-center justify-center hover:bg-zinc-200 transition-colors"
        >
          Sign in
        </button>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <GradientText
          colors={["#F3F4F6", "#9CA3AF", "#4B5563"]}
          animationSpeed={8}
          showBorder={false}
          className=" text-6xl "
        >
          Build workflows without code
        </GradientText>
        <p className="text-lg mt-4 text-gray-300 max-w-xl">
          Automate your backend logic visually. Triggers, actions, and branching
          — all in one powerful canvas.
        </p>

        {/* Mac-style Terminal */}
        <div className="mt-10 w-full max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/90 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-zinc-700/50 bg-zinc-800/80 px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-zinc-500" />
                  <span className="h-3 w-3 rounded-full bg-zinc-600" />
                  <span className="h-3 w-3 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-sm text-zinc-300">
                  &gt;_ aurel.dev
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-500">idle</span>
            </div>

            {/* Terminal Body */}
            <div className="min-h-[100px] bg-zinc-900 px-6 py-5 font-mono text-lg text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500">&gt;</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
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
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between border-t border-zinc-700/50 bg-zinc-900 px-4 py-2">
              <div className="flex items-center gap-4 font-mono text-sm text-zinc-500">
                <span className="rounded-full bg-zinc-700/60 px-3 py-1 text-zinc-300">
                  ∞
                </span>
                <span>templates</span>
                <span className="text-zinc-600">|</span>
                <span>0 / 200</span>
              </div>

              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-800/80 transition hover:bg-zinc-700/80">
                <span className="text-zinc-300">→</span>
              </button>
            </div>
          </div>
        </div>
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
