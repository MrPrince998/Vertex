"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const links: {
    to: string;
    label: string;
  }[] = [
    { to: "/", label: "Home" },
    { to: "/queue", label: "Queue" },
    { to: "/history", label: "History" },
  ] as const;

  return (
    <div className="border-b border-white/10 bg-[#071011]/95 text-white backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-row items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          className="flex shrink-0 items-center gap-2 font-semibold"
          href="/"
        >
          <Image
            alt="Vextro"
            className="size-8"
            height={32}
            priority
            src="/vextro-logo.svg"
            width={32}
          />
          <span>Vextro</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm text-white/58 w-auto">
          {links.map(({ to, label }) => {
            return (
              <Link
                className="shrink-0 px-3 py-2 transition hover:bg-white/8 hover:text-white"
                key={label}
                href={to as Route}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-2 border border-lime-200/20 bg-lime-200/8 px-2.5 py-1.5 text-xs text-lime-100 sm:inline-flex">
            <Activity className="size-3.5" />
            API ready
          </span>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
