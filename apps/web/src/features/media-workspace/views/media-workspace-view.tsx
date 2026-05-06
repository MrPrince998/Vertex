import {
  Activity,
  AudioLines,
  Gauge,
  ImageDown,
  Link2,
  ShieldCheck,
  Sparkles,
  Video,
  Wand,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { mediaOptionSets } from "../constants";
import { JobRow } from "../components/job-row";
import { Metric } from "../components/metric";
import { ProgressStat } from "../components/progress-stat";
import { QueueStrip } from "../components/queue-strip";
import { Segment } from "../components/segment";
import { SourceFileUpload } from "../components/source-file-upload";
import type {
  JobCommandAction,
  JobType,
  MediaJob,
  RecentFile,
  ToolConfig,
} from "../types";

type MediaWorkspaceViewProps = {
  activeTool: JobType;
  activeToolConfig: ToolConfig;
  apiOnline: boolean;
  averageProgress: number;
  bitrate: string;
  completedCount: number;
  completionRate: number;
  endTime: string;
  format: string;
  isSubmitting: boolean;
  jobs: MediaJob[];
  preset: string;
  quality: string;
  recentFiles: RecentFile[];
  runningCount: number;
  source: string;
  startTime: string;
  tools: ToolConfig[];
  onActiveToolChange: (tool: JobType) => void;
  onBitrateChange: (value: string) => void;
  onCommandJob: (job: MediaJob, action: JobCommandAction) => void;
  onCreateJob: () => void;
  onDownloadJob: (job: MediaJob) => void;
  onEndTimeChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onPresetChange: (value: string) => void;
  onQualityChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
};

export function MediaWorkspaceView({
  activeTool,
  activeToolConfig,
  apiOnline,
  averageProgress,
  bitrate,
  completedCount,
  completionRate,
  endTime,
  format,
  isSubmitting,
  jobs,
  preset,
  quality,
  recentFiles,
  runningCount,
  source,
  startTime,
  tools,
  onActiveToolChange,
  onBitrateChange,
  onCommandJob,
  onCreateJob,
  onDownloadJob,
  onEndTimeChange,
  onFormatChange,
  onPresetChange,
  onQualityChange,
  onSourceChange,
  onStartTimeChange,
}: MediaWorkspaceViewProps) {
  const ActiveIcon = activeToolConfig.icon;

  return (
    <main className="min-h-0 overflow-y-auto bg-(--vextro-bg) text-(--vextro-ink)">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(51,145,255,0.24),transparent_34%),linear-gradient(135deg,#061518_0%,#101315_48%,#17100b_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="flex min-h-72 flex-col justify-between gap-8 lg:min-h-107.5">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-100">
                <ShieldCheck className="size-3.5" />
                Backend + frontend mode
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
                  Vextro
                </h1>
                <p className="max-w-2xl text-pretty text-base leading-7 text-white/72 sm:text-lg">
                  A clean media operations desk for downloads, MP3 extraction,
                  trimming, compression, and image conversion.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Active jobs"
                value={runningCount.toString()}
                detail="in memory"
              />
              <Metric
                label="Completed"
                value={completedCount.toString()}
                detail="this session"
              />
              <Metric
                label="Queue health"
                value={apiOnline ? "API" : "Offline"}
                detail={apiOnline ? "online" : "server unavailable"}
              />
            </div>
          </div>

          <div className="min-w-0 self-end border border-white/12 bg-black/28 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                  Live Queue
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Processing overview
                </h2>
              </div>
              <Gauge className="size-8 text-lime-200" />
            </div>
            <div className="space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <QueueStrip key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr_320px] lg:px-8">
        <aside className="space-y-3">
          <div className="border border-(--vextro-line) bg-(--vextro-panel) p-3">
            <p className="px-2 py-1 text-xs uppercase tracking-[0.2em] text-(--vextro-muted)">
              Tools
            </p>
            <div className="mt-2 space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const selected = tool.id === activeTool;
                return (
                  <button
                    key={tool.id}
                    className={cn(
                      "flex w-full items-center gap-3 border px-3 py-3 text-left transition",
                      selected
                        ? "border-cyan-300/60 bg-cyan-200/12 text-cyan-50"
                        : "border-transparent text-(--vextro-soft) hover:border-(--vextro-line) hover:bg-white/5",
                    )}
                    onClick={() => onActiveToolChange(tool.id)}
                    type="button"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {tool.label}
                      </span>
                      <span className="block truncate text-xs opacity-60">
                        {tool.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-(--vextro-line) bg-(--vextro-panel) p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4 text-lime-300" />
              Session stats
            </div>
            <div className="space-y-4">
              <ProgressStat label="Average progress" value={averageProgress} />
              <ProgressStat label="Completion rate" value={completionRate} />
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section
            id="workspace"
            className="scroll-mt-20 border border-(--vextro-line) bg-(--vextro-panel) p-4 sm:p-5"
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-(--vextro-muted)">
                  Workspace
                </p>
                <h2 className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                  <ActiveIcon className="size-6 text-cyan-300" />
                  {activeToolConfig.label}
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 border border-(--vextro-line) bg-black/15 px-3 py-2 text-xs text-(--vextro-muted)">
                <Sparkles className="size-3.5 text-amber-200" />
                Storage: browser + server memory
              </div>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Link2 className="size-4 text-(--vextro-muted)" />
                  URL or file name
                </span>
                <Input
                  className="h-12 border-(--vextro-line) bg-black/20 text-sm text-white placeholder:text-white/32"
                  onChange={(event) => onSourceChange(event.target.value)}
                  placeholder="https://example.com/your-owned-media or uploaded-file.mp4"
                  value={source}
                />
              </label>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {activeTool === "download" && (
                  <Segment
                    label="Quality"
                    options={mediaOptionSets.quality}
                    value={quality}
                    onChange={onQualityChange}
                  />
                )}
                {(activeTool === "mp3" || activeTool === "clip") && (
                  <Segment
                    label="Bitrate"
                    options={mediaOptionSets.bitrate}
                    value={bitrate}
                    onChange={onBitrateChange}
                  />
                )}
                {activeTool === "compress" && (
                  <Segment
                    label="Preset"
                    options={mediaOptionSets.preset}
                    value={preset}
                    onChange={onPresetChange}
                  />
                )}
                {activeTool === "image" && (
                  <Segment
                    label="Format"
                    options={mediaOptionSets.format}
                    value={format}
                    onChange={onFormatChange}
                  />
                )}
                {activeTool === "clip" && (
                  <>
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.16em] text-(--vextro-muted)">
                        Start
                      </span>
                      <Input
                        className="h-10 border-(--vextro-line) bg-black/20 text-white"
                        onChange={(event) =>
                          onStartTimeChange(event.target.value)
                        }
                        value={startTime}
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.16em] text-(--vextro-muted)">
                        End
                      </span>
                      <Input
                        className="h-10 border-(--vextro-line) bg-black/20 text-white"
                        onChange={(event) =>
                          onEndTimeChange(event.target.value)
                        }
                        value={endTime}
                      />
                    </label>
                  </>
                )}
              </div>

              <SourceFileUpload onSourceChange={onSourceChange} />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="h-11 rounded-none bg-cyan-200 px-4 text-sm font-semibold text-zinc-950 hover:bg-cyan-100"
                  disabled={isSubmitting}
                  onClick={onCreateJob}
                  type="button"
                >
                  <Wand data-icon="inline-start" />
                  {isSubmitting ? "Adding..." : "Start job"}
                </Button>
              </div>
            </div>
          </section>

          <section
            id="queue"
            className="scroll-mt-20 border border-(--vextro-line) bg-(--vextro-panel)"
          >
            <div className="flex items-center justify-between border-b border-(--vextro-line) px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-(--vextro-muted)">
                  Queue
                </p>
                <h2 className="text-lg font-semibold">
                  Smart processing queue
                </h2>
              </div>
              <p className="text-xs text-(--vextro-muted)">
                {jobs.length} jobs
              </p>
            </div>
            <div className="divide-y divide-(--vextro-line)">
              {jobs.length ? (
                jobs.map((job) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    onCommand={onCommandJob}
                    onDownload={onDownloadJob}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-(--vextro-muted)">
                  No jobs yet. Add a URL or file to start.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section
            id="history"
            className="scroll-mt-20 border border-(--vextro-line) bg-(--vextro-panel) p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Media preview</h2>
              <Video className="size-5 text-cyan-200" />
            </div>
            <div className="aspect-video border border-white/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(250,204,21,0.12)),url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 viewBox=%220 0 120 120%22%3E%3Cpath d=%22M0 60h120M60 0v120%22 stroke=%22rgba(255,255,255,.08)%22/%3E%3C/svg%3E')] p-4">
              <div className="flex h-full flex-col justify-between">
                <AudioLines className="size-8 text-cyan-100" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Preview metadata
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/55">
                    Duration 04:28 / 1920x1080 / public or user-owned source
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border border-(--vextro-line) bg-(--vextro-panel) p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent files</h2>
              <ImageDown className="size-5 text-amber-200" />
            </div>
            <div className="space-y-3">
              {recentFiles.length ? (
                recentFiles.map((file) => (
                  <div
                    key={file.title}
                    className="border border-(--vextro-line) bg-black/15 p-3"
                  >
                    <p className="truncate text-sm font-medium">{file.title}</p>
                    <p className="mt-1 text-xs text-(--vextro-muted)">
                      {file.meta}
                    </p>
                  </div>
                ))
              ) : (
                <p className="border border-(--vextro-line) bg-black/15 p-3 text-xs text-(--vextro-muted)">
                  No recent files yet.
                </p>
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
