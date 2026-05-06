import type { LucideIcon } from "lucide-react";

export type JobType = "download" | "mp3" | "clip" | "compress" | "image";

export type JobStatus =
  | "queued"
  | "downloading"
  | "converting"
  | "compressing"
  | "completed"
  | "failed"
  | "paused"
  | "cancelled";

export type MediaJob = {
  id: string;
  type: JobType;
  status: JobStatus;
  title: string;
  source: string;
  progress: number;
  speed: string;
  eta: string;
  size: string;
  outputSize?: string;
  savedStorage?: string;
  format: string;
  quality: string;
  createdAt: string;
};

export type JobCommandAction = "pause" | "resume" | "cancel";

export type ToolConfig = {
  id: JobType;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type CreateMediaJobPayload = {
  type: JobType;
  source: string;
  quality?: string;
  bitrate?: string;
  preset?: string;
  format?: string;
  startTime?: string;
  endTime?: string;
};

export type RecentFile = {
  title: string;
  meta: string;
  type: JobType;
};
