"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CheckCircle2, MessageCircle, MousePointer2 } from "lucide-react";
import { PulsatingButton } from "../ui/pulsating-button";

export default function LandingFeaturedStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const cardOpacity = useTransform(scrollYProgress, [0.06, 0.24], [0, 1]);
  const cardX = useTransform(scrollYProgress, [0.06, 0.24], [-56, 0]);
  const cardY = useTransform(scrollYProgress, [0.06, 0.24], [24, 0]);

  const bubbleY = useTransform(scrollYProgress, [0, 1], [8, 296]);
  const bubbleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 6, -4]);
  const fillOpacity = useTransform(scrollYProgress, [0.05, 0.42], [0, 1]);
  const highlightSize = useTransform(
    scrollYProgress,
    [0.15, 0.74],
    ["0% 100%", "100% 100%"],
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[170vh] border-y border-white/10 bg-zinc-950 px-6 py-20 md:px-10 md:py-24"
    >
      <div className="mx-auto mb-10 max-w-6xl md:mb-14">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Featured
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-zinc-100 md:text-4xl">
          Scroll through one execution timeline and see how collaboration stays
          attached to logic.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
          Aurel keeps comments, decision branches, and approvals in the same
          place where workflows run.
        </p>
      </div>

      <div className="sticky top-0 mx-auto flex min-h-[88vh] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.02fr_1fr]">
          <motion.article
            style={
              reduceMotion
                ? undefined
                : {
                    opacity: cardOpacity,
                    x: cardX,
                    y: cardY,
                  }
            }
            className="rounded-3xl border border-white/12 bg-zinc-900/ p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                <span className="flex items-center gap-2">
                  <PulsatingButton
                    aria-label="Live status"
                    pulseColor="#22c55e"
                    duration="1.5s"
                    className="h-2 w-2 rounded-full bg-emerald-500 p-0 text-transparent shadow-none pointer-events-none"
                  >
                    .
                  </PulsatingButton>{" "}
                  Live Workflow
                </span>
              </p>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                Running...
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-semibold text-zinc-100 md:text-3xl">
              Invoice approval flow
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
              Teams can review what happened, why it branched, and who approved
              the next step without leaving the run context.
            </p>

            <div className="mt-7 space-y-3">
              <div className="rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-zinc-100">
                Trigger:{" "}
                <span className="text-zinc-300">`invoice.created`</span>
              </div>
              <div className="rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-zinc-100">
                Condition:{" "}
                <span className="text-zinc-300">amount {">"} 10000</span>
              </div>
              <div className="rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-zinc-100">
                Action:{" "}
                <span className="text-zinc-300">
                  request finance approval + notify Slack
                </span>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-zinc-800/90 px-3 py-2 text-xs text-zinc-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Approval synced to run timeline
            </div>
          </motion.article>

          <div className="rounded-3xl border border-white/12 bg-zinc-950 p-6 backdrop-blur-sm md:p-8">
            <div className="relative h-[360px] md:h-[390px]">
              <svg
                className="absolute left-3 top-3 h-[330px] w-8 md:left-4 md:h-[350px]"
                viewBox="0 0 24 360"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 6 C 12 78, 12 120, 12 186 C 12 248, 12 300, 12 354"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <motion.path
                  d="M12 6 C 12 78, 12 120, 12 186 C 12 248, 12 300, 12 354"
                  stroke="rgba(253,239,194,0.92)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={
                    reduceMotion
                      ? undefined
                      : { pathLength: scrollYProgress, opacity: fillOpacity }
                  }
                />
              </svg>

              <motion.div
                style={reduceMotion ? undefined : { y: bubbleY, x: bubbleX }}
                className="absolute left-[0.7rem] top-1.5 z-20 md:left-[0.95rem]"
              >
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-xl">
                  <MousePointer2 className="h-3.5 w-3.5" />
                  <MessageCircle className="h-3.5 w-3.5" />
                  Added comment
                </div>
              </motion.div>

              <div className="ml-14 md:ml-16">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Knowledge Layer
                </p>
                <h3 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-4xl">
                  Every decision
                  <br />
                  stays traceable
                </h3>
                <p className="mt-5 text-sm leading-7 text-zinc-300 md:text-base">
                  <motion.span
                    style={
                      reduceMotion
                        ? undefined
                        : {
                            backgroundSize: highlightSize,
                          }
                    }
                    className="rounded-sm bg-[linear-gradient(rgba(253,239,194,0.95),rgba(253,239,194,0.95))] bg-left-bottom bg-no-repeat px-1 text-zinc-950"
                  >
                    Share docs, review comments, and branch rationale directly
                    beside the run timeline.
                  </motion.span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
