"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { createMediaJob } from "../api/media-jobs-api";
import { mediaTools } from "../constants";
import { useMediaJobs } from "../hooks/use-media-jobs";
import type {
  CreateMediaJobPayload,
  JobType,
  RecentFile,
} from "../types";
import { MediaWorkspaceView } from "../views/media-workspace-view";

export function MediaWorkspaceContainer() {
  const [activeTool, setActiveTool] = useState<JobType>("download");
  const [source, setSource] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [bitrate, setBitrate] = useState("320kbps");
  const [preset, setPreset] = useState("Instagram");
  const [format, setFormat] = useState("MP4");
  const [startTime, setStartTime] = useState("00:42");
  const [endTime, setEndTime] = useState("01:18");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoDownloadJobIdsRef = useRef<Set<string>>(new Set());
  const { apiOnline, commandJob, downloadJob, jobs, setApiOnline, setJobs } =
    useMediaJobs({ poll: true });

  useEffect(() => {
    jobs.forEach((job) => {
      const shouldDownload =
        job.status === "completed" && autoDownloadJobIdsRef.current.has(job.id);

      if (!shouldDownload) return;

      autoDownloadJobIdsRef.current.delete(job.id);
      void downloadJob(job, `${job.title} downloaded automatically.`);
    });
  }, [downloadJob, jobs]);

  const activeToolConfig = useMemo(
    () => mediaTools.find((tool) => tool.id === activeTool) ?? mediaTools[0],
    [activeTool],
  );
  const { averageProgress, completedCount, completionRate, runningCount } =
    useMemo(() => {
      if (!jobs.length) {
        return {
          averageProgress: 0,
          completedCount: 0,
          completionRate: 0,
          runningCount: 0,
        };
      }

      const stats = jobs.reduce(
        (total, job) => {
          total.progress += job.progress;

          if (job.status === "completed") {
            total.completed += 1;
          }

          if (
            job.status === "downloading" ||
            job.status === "converting" ||
            job.status === "compressing"
          ) {
            total.running += 1;
          }

          return total;
        },
        { completed: 0, progress: 0, running: 0 },
      );

      return {
        averageProgress: Math.round(stats.progress / jobs.length),
        completedCount: stats.completed,
        completionRate: Math.round((stats.completed / jobs.length) * 100),
        runningCount: stats.running,
      };
    }, [jobs]);

  const recentFiles = useMemo<RecentFile[]>(
    () =>
      jobs
        .filter((job) => job.status === "completed")
        .slice(0, 4)
        .map((job) => ({
          title: job.title,
          meta: `${job.format} / ${job.quality} / ${job.size}`,
          type: job.type,
        })),
    [jobs],
  );

  const handleCreateJob = useCallback(async () => {
    const trimmedSource = source.trim();
    if (!trimmedSource) {
      toast.error("Add a URL or file name first.");
      return;
    }

    const payload = buildCreateJobPayload({
      activeTool,
      source: trimmedSource,
      quality,
      bitrate,
      preset,
      format,
      startTime,
      endTime,
    });

    setIsSubmitting(true);
    try {
      const created = await createMediaJob(payload);
      autoDownloadJobIdsRef.current.add(created.id);
      setJobs((current) => [created, ...current]);
      setSource("");
      setApiOnline(true);
      toast.success("Job added. It will download automatically when ready.");
    } catch {
      setApiOnline(false);
      toast.error(
        "Could not create the job because the backend server is unavailable.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeTool,
    bitrate,
    endTime,
    format,
    preset,
    quality,
    setApiOnline,
    setJobs,
    source,
    startTime,
  ]);

  return (
    <MediaWorkspaceView
      activeTool={activeTool}
      activeToolConfig={activeToolConfig}
      apiOnline={apiOnline}
      averageProgress={averageProgress}
      bitrate={bitrate}
      completedCount={completedCount}
      completionRate={completionRate}
      endTime={endTime}
      format={format}
      isSubmitting={isSubmitting}
      jobs={jobs}
      preset={preset}
      quality={quality}
      recentFiles={recentFiles}
      runningCount={runningCount}
      source={source}
      startTime={startTime}
      tools={mediaTools}
      onActiveToolChange={setActiveTool}
      onBitrateChange={setBitrate}
      onCommandJob={commandJob}
      onCreateJob={handleCreateJob}
      onDownloadJob={downloadJob}
      onEndTimeChange={setEndTime}
      onFormatChange={setFormat}
      onPresetChange={setPreset}
      onQualityChange={setQuality}
      onSourceChange={setSource}
      onStartTimeChange={setStartTime}
    />
  );
}

function buildCreateJobPayload({
  activeTool,
  source,
  quality,
  bitrate,
  preset,
  format,
  startTime,
  endTime,
}: {
  activeTool: JobType;
  source: string;
  quality: string;
  bitrate: string;
  preset: string;
  format: string;
  startTime: string;
  endTime: string;
}): CreateMediaJobPayload {
  return {
    type: activeTool,
    source,
    quality: activeTool === "download" ? quality : undefined,
    bitrate:
      activeTool === "mp3" || activeTool === "clip" ? bitrate : undefined,
    preset: activeTool === "compress" ? preset : undefined,
    format: activeTool === "image" ? format : undefined,
    startTime: activeTool === "clip" ? startTime : undefined,
    endTime: activeTool === "clip" ? endTime : undefined,
  };
}
