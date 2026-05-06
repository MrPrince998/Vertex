export type MediaJobType = "download" | "mp3" | "clip" | "compress" | "image";

export class CreateJobDto {
  type?: MediaJobType;
  source?: string;
  title?: string;
  quality?: string;
  format?: string;
  bitrate?: "128kbps" | "192kbps" | "320kbps";
  preset?: string;
  startTime?: string;
  endTime?: string;
}
