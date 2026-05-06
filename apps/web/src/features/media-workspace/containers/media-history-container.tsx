"use client";

import { Download, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

import { jobTypeIcons } from "../constants";
import { useMediaJobs } from "../hooks/use-media-jobs";
import type { MediaJob } from "../types";

export function MediaHistoryContainer() {
  const { apiOnline, commandJob, downloadJob, jobs } = useMediaJobs();

  const completedJobs = useMemo(
    () => jobs.filter((job) => job.status === "completed"),
    [jobs],
  );

  return (
    <main className="min-h-0 overflow-y-auto bg-(--vextro-bg) px-4 py-6 text-(--vextro-ink) sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--vextro-muted)">
              History
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Completed files</h1>
          </div>
          <p className="border border-(--vextro-line) bg-(--vextro-panel) px-3 py-2 text-xs text-(--vextro-muted)">
            {apiOnline ? "Backend online" : "Backend offline"} /{" "}
            {completedJobs.length} ready
          </p>
        </div>

        {completedJobs.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {completedJobs.map((job) => {
              const Icon = jobTypeIcons[job.type];

              return (
                <article
                  className="border border-(--vextro-line) bg-(--vextro-panel) p-4"
                  key={job.id}
                >
                  <div className="mb-4 flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center border border-(--vextro-line) bg-black/20">
                      <Icon className="size-4 text-cyan-200" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold">
                        {job.title}
                      </h2>
                      <p className="mt-1 truncate text-xs text-(--vextro-muted)">
                        {job.source}
                      </p>
                    </div>
                  </div>
                  <p className="mb-4 text-xs text-(--vextro-muted)">
                    {job.format} / {job.quality} / {job.size}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon-sm"
                      type="button"
                      variant="outline"
                      onClick={() => downloadJob(job)}
                    >
                      <Download data-icon="inline-start" />
                    </Button>
                    <Button
                      size="icon-sm"
                      type="button"
                      variant="outline"
                      onClick={() => commandJob(job, "cancel")}
                    >
                      <Trash2 data-icon="inline-start" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No completed files"
            description="Finished jobs will show up here."
          />
        )}
      </section>
    </main>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 border border-(--vextro-line) bg-(--vextro-panel) px-4 py-10 text-center">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="max-w-sm text-xs text-(--vextro-muted)">{description}</p>
    </div>
  );
}
