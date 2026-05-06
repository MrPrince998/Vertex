import {
  Download,
  FileArchive,
  FileImage,
  Music2,
  Scissors,
} from "lucide-react";

import type { JobType, ToolConfig } from "./types";

export const mediaTools: ToolConfig[] = [
  { id: "download", label: "Downloader", description: "MP4 with quality preview", icon: Download },
  { id: "mp3", label: "MP3", description: "Extract audio cleanly", icon: Music2 },
  { id: "clip", label: "Clip MP3", description: "Trim a precise section", icon: Scissors },
  { id: "compress", label: "Compress", description: "Reduce size for sharing", icon: FileArchive },
  { id: "image", label: "Images", description: "Batch format conversion", icon: FileImage },
];

export const jobTypeIcons: Record<JobType, ToolConfig["icon"]> = {
  download: Download,
  mp3: Music2,
  clip: Scissors,
  compress: FileArchive,
  image: FileImage,
};

export const mediaOptionSets = {
  bitrate: ["128kbps", "192kbps", "320kbps"],
  format: ["PNG", "JPG", "WEBP"],
  preset: ["WhatsApp", "Instagram", "High Quality"],
  quality: ["720p", "1080p", "1440p"],
} as const;
