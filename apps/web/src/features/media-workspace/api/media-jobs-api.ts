import type {
  CreateMediaJobPayload,
  JobCommandAction,
  MediaJob,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export async function fetchMediaJobs() {
  const response = await fetch(`${API_URL}/jobs`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load media jobs");
  }

  return (await response.json()) as MediaJob[];
}

export async function createMediaJob(payload: CreateMediaJobPayload) {
  const response = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to create media job");
  }

  return (await response.json()) as MediaJob;
}

export async function updateMediaJobCommand(
  jobId: string,
  action: JobCommandAction,
) {
  const url =
    action === "cancel"
      ? `${API_URL}/jobs/${jobId}`
      : `${API_URL}/jobs/${jobId}/${action}`;
  const method = action === "cancel" ? "DELETE" : "POST";
  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new Error(`Unable to ${action} media job`);
  }

  return (await response.json()) as MediaJob;
}

export async function deleteMediaJob(jobId: string) {
  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete media job");
  }

  return (await response.json()) as { id: string; deleted: boolean };
}

export async function downloadMediaJobOutput(jobId: string) {
  const response = await fetch(`${API_URL}/jobs/${jobId}/download`);

  if (!response.ok) {
    throw new Error("Unable to download media job output");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename = getDownloadFilename(disposition);

  triggerBrowserDownload(blob, filename);
}

function getDownloadFilename(disposition: string | null) {
  const encodedFilename = disposition?.match(
    /filename\*=UTF-8''([^;]+)/,
  )?.[1];
  const quotedFilename = disposition?.match(/filename="([^"]+)"/)?.[1];
  const rawFilename = encodedFilename ?? quotedFilename;

  return rawFilename ? decodeURIComponent(rawFilename) : "vextro-output.bin";
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
