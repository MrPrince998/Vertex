"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-svh place-items-center bg-[#081011] px-4 py-10 text-[#f4f7f2]">
          <section className="w-full max-w-xl border border-white/12 bg-white/6 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Application error</p>
            <h1 className="mt-3 text-3xl font-semibold">Something went wrong</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">
              Vextro hit an unexpected error while rendering this page.
            </p>
            {error.digest ? <p className="mt-3 text-xs text-white/45">Digest: {error.digest}</p> : null}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button className="rounded-none" onClick={reset} type="button" variant="outline">
                Try again
              </Button>
              <Link className={cn(buttonVariants({ variant: "outline" }), "rounded-none")} href="/">
                Back to workspace
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
