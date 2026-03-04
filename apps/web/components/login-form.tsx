"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Github } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);
  const isLoading = loadingProvider !== null;

  const handleProviderSignIn = async (provider: "google" | "github") => {
    if (isLoading) return;
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden backdrop-blur-xl border-white/10 bg-zinc-950/95 p-0 text-zinc-100 shadow-2xl">
        <CardContent className="grid min-h-[560px] p-0 md:min-h-[620px] md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-32">
                <h1 className="text-2xl font-semibold text-zinc-100">
                  Welcome to{" "}
                  <span className="font-m1 text-black px-2 bg-[#FDEFC2]">
                    aurel.
                  </span>
                </h1>
                <p className="text-balance text-zinc-400">
                  Sign in to your account
                </p>
              </div>

              <Field>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer justify-center border-white/15 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  disabled={isLoading}
                  aria-busy={loadingProvider === "github"}
                  onClick={() => handleProviderSignIn("github")}
                >
                  {loadingProvider === "github" ? (
                    <Spinner width={18} height={18} />
                  ) : (
                    <>
                      <Github fill="white" />
                      Continue with GitHub
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer justify-center border-white/15 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                  disabled={isLoading}
                  aria-busy={loadingProvider === "google"}
                  onClick={() => handleProviderSignIn("google")}
                >
                  {loadingProvider === "google" ? (
                    <Spinner width={18} height={18} />
                  ) : (
                    <>
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={18}
                        height={18}
                      />
                      Continue with Google
                    </>
                  )}
                </Button>
              </Field>

              <FieldDescription className="text-center text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/dashboard" className="text-zinc-200">
                  Start with dashboard
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden border-l border-white/10 md:block">
            <Image
              src="/bg.png"
              width={960}
              height={1200}
              alt="Aurel workflow preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/65" />
            <div className="absolute bottom-32 left-6 right-6 text-5xl font-semibold leading-tight tracking-tight text-[#FDEFC2]">
              Automate faster, ship smarter !
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/15 bg-black/35 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-zinc-100">
                Build once, monitor forever.
              </p>
              <p className="mt-1 text-xs text-zinc-300">
                Visual workflows, branching logic, and observability in one
                place.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-zinc-500">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-zinc-300">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-zinc-300">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
