"use client";

import Link from "next/link";
import Icon from "@/public/icon";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Highlighter } from "@/components/ui/highlighter";

const productLinks = [
  { label: "Workflow Builder", href: "/dashboard" },
  { label: "Executions", href: "/executions" },
  { label: "API Integrations", href: "/dashboard" },
];

const resourceLinks = [
  { label: "Docs", href: "#" },
  { label: "Guides", href: "#" },
  { label: "Changelog", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-zinc-300">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
        <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-900 px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">
                Ready to launch
              </p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-100 md:text-2xl">
                Build and ship your first workflow in minutes !
              </h3>
            </div>
            <NoiseBackground
              containerClassName="w-fit self-end rounded-full p-2 md:ml-auto"
              gradientColors={[
                "rgb(255, 100, 150)",
                "rgb(100, 150, 255)",
                "rgb(255, 200, 100)",
              ]}
              noiseIntensity={0.24}
              speed={0.18}
            >
              <Link
                href="/dashboard"
                className="inline-flex h-full w-full items-center justify-center cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
              >
                Start Building →
              </Link>
            </NoiseBackground>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Icon size={30} />
              <span className="font-m1 text-2xl font-semibold text-zinc-100">
                aurel.
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              Visual backend automation for modern product teams. Design,
              branch, and monitor workflows without writing boilerplate.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">Product</p>
            <ul className="mt-4 space-y-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 transition-colors hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">Resources</p>
            <ul className="mt-4 space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 transition-colors hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 transition-colors hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Aurel Labs. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="#" className="hover:text-zinc-300">
              Terms
            </Link>
            <Link href="#" className="hover:text-zinc-300">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
