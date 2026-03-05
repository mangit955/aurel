"use client";

import type { CSSProperties } from "react";
import MagicBento from "@/components/MagicBento";
import LandingFeaturedStory from "./main_1";

export default function LandingMain() {
  return (
    <>
      <section id="platform-overview" className="relative mt-20 overflow-hidden border-y border-white/10 bg-zinc-950 py-10 text-zinc-100 md:px-8 md:py-12">
        <div className="relative z-10 mb-6 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-500">
            Platform Overview
          </p>
          <h2 className="mt-2 text-2xl font-mono font-semibold text-[#FDEFC2] md:text-3xl">
            Visual Automation That Stays Production-Ready
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-zinc-400">
            Build backend workflows with webhooks, branching logic, HTTP
            actions, and observability in one place.
          </p>
        </div>

        <div
          className="relative z-10 flex justify-center"
          style={
            {
              "--background-dark": "#09090b",
              "--border-color": "#3f3f46",
              "--purple-primary": "rgba(156, 64, 255, 1)",
              "--purple-glow": "rgba(156, 64, 255, 0.2)",
              "--purple-border": "rgba(255, 170, 64, 0.7)",
              "--glow-rgb": "255, 170, 64",
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

      <LandingFeaturedStory />
    </>
  );
}
