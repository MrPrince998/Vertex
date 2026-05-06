import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { CreateJobDto, type MediaJobType } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { Job, type MediaJobStatus } from "./entities/job.entity";

const TYPE_STATUS: Record<MediaJobType, MediaJobStatus> = {
  download: "downloading",
  mp3: "converting",
  clip: "converting",
  compress: "compressing",
  image: "converting",
};

const TYPE_COPY: Record<MediaJobType, { title: string; format: string; quality: string; durationMs: number }> = {
  download: { title: "Public media download", format: "MP4", quality: "1080p", durationMs: 54_000 },
  mp3: { title: "Audio extraction", format: "MP3", quality: "320kbps", durationMs: 42_000 },
  clip: { title: "Clip to MP3", format: "MP3", quality: "192kbps", durationMs: 32_000 },
  compress: { title: "Video compression", format: "MP4", quality: "High Quality", durationMs: 48_000 },
  image: { title: "Image conversion batch", format: "WEBP", quality: "82%", durationMs: 24_000 },
};

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();

  async create(createJobDto: CreateJobDto) {
    const type = createJobDto.type ?? "download";
    const defaults = TYPE_COPY[type];
    const now = Date.now();
    const source = createJobDto.source?.trim() || "Uploaded media";
    const title = createJobDto.title?.trim() || (await this.createTitle(source, defaults.title));

    const job: Job = {
      id: randomUUID(),
      type,
      status: TYPE_STATUS[type],
      title,
      source,
      progress: 0,
      speed: this.speedFor(type),
      eta: "Calculating",
      size: this.sizeFor(type),
      outputSize: type === "compress" ? "84 MB" : undefined,
      savedStorage: type === "compress" ? "61%" : undefined,
      format: createJobDto.format ?? defaults.format,
      quality: createJobDto.bitrate ?? createJobDto.quality ?? createJobDto.preset ?? defaults.quality,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      durationMs: defaults.durationMs,
      startedAt: now,
    };

    this.jobs.set(job.id, job);
    return this.hydrate(job);
  }

  findAll() {
    return Array.from(this.jobs.values())
      .map((job) => this.hydrate(job))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  findOne(id: string) {
    return this.hydrate(this.getJob(id));
  }

  getDownload(id: string) {
    const job = this.hydrate(this.getJob(id));
    const extension = this.extensionFor(job.format);
    const filename = `${this.slugify(job.title)}.${extension}`;
    const content = [
      "Vextro generated media placeholder",
      `Job ID: ${job.id}`,
      `Title: ${job.title}`,
      `Source: ${job.source}`,
      `Type: ${job.type}`,
      `Format: ${job.format}`,
      `Quality: ${job.quality}`,
      `Status: ${job.status}`,
      "",
      "Real media bytes will be returned from this endpoint once the processing pipeline is added.",
    ].join("\n");

    return {
      buffer: Buffer.from(content),
      filename,
      mimeType: this.mimeTypeFor(extension),
    };
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    const job = this.getJob(id);

    if (updateJobDto.title) job.title = updateJobDto.title;
    if (updateJobDto.quality) job.quality = updateJobDto.quality;
    if (updateJobDto.format) job.format = updateJobDto.format;
    job.updatedAt = new Date().toISOString();

    return this.hydrate(job);
  }

  pause(id: string) {
    const job = this.getJob(id);
    const hydrated = this.hydrate(job);

    if (hydrated.status !== "completed" && hydrated.status !== "cancelled") {
      job.progress = hydrated.progress;
      job.status = "paused";
      job.pausedAt = Date.now();
      job.updatedAt = new Date().toISOString();
    }

    return this.hydrate(job);
  }

  resume(id: string) {
    const job = this.getJob(id);

    if (job.status === "paused") {
      const pausedFor = Date.now() - (job.pausedAt ?? Date.now());
      job.startedAt += pausedFor;
      job.status = TYPE_STATUS[job.type];
      job.pausedAt = undefined;
      job.updatedAt = new Date().toISOString();
    }

    return this.hydrate(job);
  }

  remove(id: string) {
    const job = this.getJob(id);
    this.jobs.delete(id);
    return { id: job.id, deleted: true };
  }

  private getJob(id: string) {
    const job = this.jobs.get(id);
    if (!job) throw new NotFoundException(`Job ${id} was not found`);
    return job;
  }

  private hydrate(job: Job) {
    if (job.status === "paused" || job.status === "cancelled" || job.status === "failed") {
      return { ...job };
    }

    const elapsed = Date.now() - job.startedAt;
    const progress = Math.min(100, Math.max(job.progress, Math.round((elapsed / job.durationMs) * 100)));
    const remainingMs = Math.max(0, job.durationMs - elapsed);
    const completed = progress >= 100;

    job.progress = progress;
    job.status = completed ? "completed" : TYPE_STATUS[job.type];
    job.eta = completed ? "Ready" : this.formatEta(remainingMs);
    job.updatedAt = new Date().toISOString();

    return { ...job };
  }

  private async createTitle(source: string, fallback: string) {
    if (source === "Uploaded media") return fallback;

    const fileName = source.split(/[\\/]/).filter(Boolean).at(-1);
    if (fileName && !source.startsWith("http")) {
      return fileName.slice(0, 96);
    }

    try {
      const url = new URL(source);
      const metadataTitle = await this.resolveOEmbedTitle(url);
      if (metadataTitle) return metadataTitle;

      const pathName = decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? "");
      const videoId = url.searchParams.get("v");

      if (pathName) return pathName.slice(0, 96);
      if (videoId) return `${url.hostname.replace(/^www\./, "")}-${videoId}`.slice(0, 96);
      return url.hostname.replace(/^www\./, "").slice(0, 96);
    } catch {
      return source.slice(0, 72) || fallback;
    }
  }

  private async resolveOEmbedTitle(url: URL) {
    const endpoint = this.oEmbedEndpointFor(url);
    if (!endpoint) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) return null;

      const data = (await response.json()) as { title?: unknown };
      if (typeof data.title !== "string") return null;

      const title = data.title.trim();
      return title ? title.slice(0, 120) : null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private oEmbedEndpointFor(url: URL) {
    const host = url.hostname.replace(/^www\./, "");
    const encodedUrl = encodeURIComponent(url.toString());

    if (host === "youtube.com" || host === "youtu.be") {
      return `https://www.youtube.com/oembed?format=json&url=${encodedUrl}`;
    }

    if (host === "vimeo.com") {
      return `https://vimeo.com/api/oembed.json?url=${encodedUrl}`;
    }

    if (host === "soundcloud.com") {
      return `https://soundcloud.com/oembed?format=json&url=${encodedUrl}`;
    }

    return null;
  }

  private formatEta(ms: number) {
    const seconds = Math.ceil(ms / 1000);
    return `00:${seconds.toString().padStart(2, "0")}`;
  }

  private sizeFor(type: MediaJobType) {
    return {
      download: "286 MB",
      mp3: "38 MB",
      clip: "8 MB",
      compress: "216 MB",
      image: "42 MB",
    }[type];
  }

  private speedFor(type: MediaJobType) {
    return {
      download: "12.4 MB/s",
      mp3: "8.1x realtime",
      clip: "9.6x realtime",
      compress: "44 fps",
      image: "18 files/s",
    }[type];
  }

  private extensionFor(format: string) {
    const normalized = format.toLowerCase();
    if (normalized.includes("mp3")) return "mp3";
    if (normalized.includes("webp")) return "webp";
    if (normalized.includes("jpg") || normalized.includes("jpeg")) return "jpg";
    if (normalized.includes("png")) return "png";
    return "mp4";
  }

  private mimeTypeFor(extension: string) {
    return {
      jpg: "image/jpeg",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      png: "image/png",
      webp: "image/webp",
    }[extension] ?? "application/octet-stream";
  }

  private slugify(value: string) {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);

    return slug || "vextro-output";
  }
}
