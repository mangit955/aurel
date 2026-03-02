"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CreditCardIcon, Home, LogOutIcon, SettingsIcon } from "lucide-react";
import Icon from "@/public/icon";
import ScrambledText from "@/components/ScrambledText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavbarProps = {
  onSignIn?: () => void;
};

export default function Navbar({ onSignIn }: NavbarProps) {
  const { data: session } = useSession();

  const displayName =
    session?.user?.name?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-40 px-6 md:px-10 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between">
        <div className="pointer-events-auto flex h-[48px] items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Icon size={36} />
            <span className="scrambled-text-demo font-m1 font-semibold !text-transparent !text-2xl leading-none bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text">
              aurel.
            </span>
          </Link>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/"
            className="h-[30px] px-2 rounded-md border border-white/25  text-white text-sm font-medium backdrop-blur-xl flex items-center justify-center hover:bg-white/20 bg-white/10 transition-colors"
          >
            <Home height={16} width={16} />
          </Link>

          {session?.user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-[40px] cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 text-white backdrop-blur-xl transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-0"
                >
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
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
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
              onClick={onSignIn}
              className="h-[30px] px-5 cursor-pointer rounded-md border border-white/30 bg-white text-black text-sm font-semibold flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
