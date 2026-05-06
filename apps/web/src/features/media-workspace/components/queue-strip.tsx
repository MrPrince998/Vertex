import type { MediaJob } from "../types";

export function QueueStrip({ job }: { job: MediaJob }) {
  return (
    <div className="border border-white/10 bg-white/7 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-white">{job.title}</p>
        <span className="text-xs text-white/50">{job.progress}%</span>
      </div>
      <div className="h-1.5 bg-white/10">
        <div className="h-full bg-cyan-200 transition-all duration-500" style={{ width: `${job.progress}%` }} />
      </div>
    </div>
  );
}
