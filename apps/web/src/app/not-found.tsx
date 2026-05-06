import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="grid min-h-0 place-items-center bg-(--vextro-bg) px-4 py-10 text-(--vextro-ink)">
      <section className="w-full max-w-xl border border-(--vextro-line) bg-(--vextro-panel) p-6 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-(--vextro-muted)">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-(--vextro-soft)">
          This route is not part of the Vextro workspace. Head back home to start or review media jobs.
        </p>
        <div className="mt-6 flex justify-center">
          <Link className={cn(buttonVariants({ variant: "outline" }), "rounded-none")} href="/">
            Back to workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
