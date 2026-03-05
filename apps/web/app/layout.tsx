import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
// app/layout.tsx
import "@xyflow/react/dist/style.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "aurel";
const siteUrlRaw =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aurel-production.up.railway.app";
const siteUrl = siteUrlRaw.replace(/\/+$/, "");
const description = "A visual engine for building event-driven automations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "aurel — Workflow automation platform",
    template: "%s | aurel",
  },

  description: description,

  applicationName: siteName,

  keywords: [
    "aurel",
    "workflow automation",
    "visual workflow builder",
    "event driven automation",
    "node based workflow",
    "workflow orchestration",
    "backend automation",
    "api automation",
    "zapier alternative",
    "n8n alternative",
    "no code automation",
    "low code automation",
    "automation platform",
    "workflow engine",
    "event driven workflows",
    "automation builder",
    "react flow workflow",
    "queue based workflow",
    "developer automation tool",
  ],

  authors: [{ name: "aurel" }],
  creator: "aurel",

  openGraph: {
    title: "aurel — Workflow automation platform",
    description: description,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: "/tw_1.png",
        width: 1200,
        height: 630,
        alt: "aurel workflow automation",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "aurel — Workflow automation platform",
    description: description,
    images: ["/tw.png"],
  },

  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
