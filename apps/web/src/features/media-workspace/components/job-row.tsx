import { CirclePause, CirclePlay, Download, Trash2 } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { jobTypeIcons } from "../constants";
import type { JobCommandAction, MediaJob } from "../types";

export const JobRow = memo(function JobRow({
  job,
  onCommand,
  onDownload,
}: {
  job: MediaJob;
  onCommand: (job: MediaJob, action: JobCommandAction) => void;
  onDownload: (job: MediaJob) => void;
}) {
  const Icon = jobTypeIcons[job.type];
  const isReady = job.status === "completed";

  return (
    <article className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_180px_112px] md:items-center">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center border border-[var(--vextro-line)] bg-black/20">
            <Icon className="size-4 text-cyan-200" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{job.title}</h3>
            <p className="truncate text-xs text-[var(--vextro-muted)]">{job.source}</p>
          </div>
        </div>
        <div className="h-2 bg-white/8">
          <div
            className={cn("h-full transition-all duration-500", job.status === "completed" ? "bg-lime-300" : "bg-cyan-300")}
            style={{ width: `${job.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs md:grid-cols-1">
        <JobMeta label="Status" value={job.status} />
        <JobMeta label="Speed" value={job.speed} />
        <JobMeta label="ETA" value={job.eta} />
      </div>

      <div className="flex items-center justify-start gap-2 md:justify-end">
        {isReady ? (
          <Button title="Download" variant="outline" size="icon-sm" onClick={() => onDownload(job)}>
            <Download data-icon="inline-start" />
          </Button>
        ) : job.status === "paused" ? (
          <Button title="Resume" variant="outline" size="icon-sm" onClick={() => onCommand(job, "resume")}>
            <CirclePlay data-icon="inline-start" />
          </Button>
        ) : (
          <Button title="Pause" variant="outline" size="icon-sm" onClick={() => onCommand(job, "pause")}>
            <CirclePause data-icon="inline-start" />
          </Button>
        )}
        <Button title="Delete" variant="outline" size="icon-sm" onClick={() => onCommand(job, "cancel")}>
          <Trash2 data-icon="inline-start" />
        </Button>
      </div>
    </article>
  );
});

function JobMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--vextro-muted)]">{label}</p>
      <p className="mt-0.5 truncate text-[var(--vextro-soft)]">{value}</p>
    </div>
  );
}
