"use client";

import type { CSSProperties } from "react";
import MagicBento from "@/components/MagicBento";

export default function LandingMain() {
  return (
    <section className="relative overflow-hidden border bg-zinc-100 mt-20 py-8 text-zinc-100 md:px-8 md:py-10">
      <div className="relative z-10 mb-6 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400">
          Platform Overview
        </p>
        <h2 className="mt-2 text-2xl font-mono font-semibold text-zinc-800 md:text-3xl">
          Visual Automation That Stays Production-Ready
        </h2>
        <p className="mx-auto mt-2 max-w-3xl text-sm text-zinc-400">
          Build backend workflows with webhooks, branching logic, HTTP actions,
          and observability in one place.
        </p>
      </div>

      <div
        className="relative z-10 flex justify-center"
        style={
          {
            "--background-dark": "#0f0f12",
            "--border-color": "#3f3f46",
            "--purple-primary": "rgba(212, 212, 216, 1)",
            "--purple-glow": "rgba(212, 212, 216, 0.14)",
            "--purple-border": "rgba(161, 161, 170, 0.65)",
            "--glow-rgb": "212, 212, 216",
          } as CSSProperties
        }
      >
        <MagicBento
          textAutoHide={false}
          enableStars
          enableSpotlight
          enableBorderGlow
          disableAnimations={false}
          spotlightRadius={260}
          particleCount={10}
          enableTilt={false}
          glowColor="212, 212, 216"
          clickEffect
          enableMagnetism={false}
        />
      </div>
    </section>
  );
}
