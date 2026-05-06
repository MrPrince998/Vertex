"use client";

import { JobRow } from "../components/job-row";
import { useMediaJobs } from "../hooks/use-media-jobs";

export function MediaQueueContainer() {
  const { apiOnline, commandJob, downloadJob, jobs } = useMediaJobs({
    poll: true,
  });

  return (
    <main className="min-h-0 overflow-y-auto bg-(--vextro-bg) px-4 py-6 text-(--vextro-ink) sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--vextro-muted)">
              Queue
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Processing queue</h1>
          </div>
          <p className="border border-(--vextro-line) bg-(--vextro-panel) px-3 py-2 text-xs text-(--vextro-muted)">
            {apiOnline ? "Backend online" : "Backend offline"} / {jobs.length}{" "}
            jobs
          </p>
        </div>

        <div className="border border-(--vextro-line) bg-(--vextro-panel)">
          {jobs.length ? (
            <div className="divide-y divide-(--vextro-line)">
              {jobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onCommand={commandJob}
                  onDownload={downloadJob}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No queue items"
              description="Start a job from the workspace and it will appear here."
            />
          )}
        </div>
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
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="max-w-sm text-xs text-(--vextro-muted)">{description}</p>
    </div>
  );
}
