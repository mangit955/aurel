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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome to Aurel !</h1>
                <p className="text-muted-foreground text-balance">
                  Sign in to your account
                </p>
              </div>

              <Field>
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={async () => {
                    setLoadingProvider("github");
                    await signIn("github", { callbackUrl: "/" });
                  }}
                >
                  {" "}
                  {loadingProvider === "github" ? (
                    <Spinner width={18} height={18} />
                  ) : (
                    <>
                      <Image
                        src="/github.png"
                        alt="google"
                        width={24}
                        height={24}
                      />
                      Continue with Github
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={async () => {
                    setLoadingProvider("google");
                    await signIn("google", { callbackUrl: "/" });
                  }}
                >
                  {" "}
                  {loadingProvider === "google" ? (
                    <Spinner width={18} height={18} />
                  ) : (
                    <>
                      <Image
                        src="/google.svg"
                        alt="google"
                        width={18}
                        height={18}
                      />
                      Continue with Google
                    </>
                  )}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className=" relative hidden md:block">
            <img
              src="/bg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
