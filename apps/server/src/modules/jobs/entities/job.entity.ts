import type { MediaJobType } from "../dto/create-job.dto";

export type MediaJobStatus =
  | "queued"
  | "downloading"
  | "converting"
  | "compressing"
  | "completed"
  | "failed"
  | "paused"
  | "cancelled";

export class Job {
  id!: string;
  type!: MediaJobType;
  status!: MediaJobStatus;
  title!: string;
  source!: string;
  progress!: number;
  speed!: string;
  eta!: string;
  size!: string;
  outputSize?: string;
  savedStorage?: string;
  format!: string;
  quality!: string;
  createdAt!: string;
  updatedAt!: string;
  durationMs!: number;
  startedAt!: number;
  pausedAt?: number;
}
