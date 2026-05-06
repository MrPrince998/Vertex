"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteMediaJob,
  downloadMediaJobOutput,
  fetchMediaJobs,
  updateMediaJobCommand,
} from "../api/media-jobs-api";
import type { JobCommandAction, MediaJob } from "../types";

type UseMediaJobsOptions = {
  poll?: boolean;
  pollIntervalMs?: number;
};

export function useMediaJobs({
  poll = false,
  pollIntervalMs = 2200,
}: UseMediaJobsOptions = {}) {
  const [jobs, setJobs] = useState<MediaJob[]>([]);
  const [apiOnline, setApiOnline] = useState(false);

  const loadJobs = useCallback(async (quiet = true) => {
    try {
      const data = await fetchMediaJobs();
      setJobs(data);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
      if (!quiet) {
        toast.error("Backend server is not responding.");
      }
    }
  }, []);

  useEffect(() => {
    void loadJobs(false);

    if (!poll) return;

    const timer = window.setInterval(() => {
      void loadJobs(true);
    }, pollIntervalMs);

    return () => window.clearInterval(timer);
  }, [loadJobs, poll, pollIntervalMs]);

  const commandJob = useCallback(
    async (job: MediaJob, action: JobCommandAction) => {
      try {
        if (action === "cancel") {
          await deleteMediaJob(job.id);
          setJobs((current) => current.filter((item) => item.id !== job.id));
          toast.success(`${job.title} deleted.`);
          return;
        }

        const updated = await updateMediaJobCommand(job.id, action);
        setJobs((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } catch {
        toast.error(`Unable to ${action} this job right now.`);
      }
    },
    [],
  );

  const downloadJob = useCallback(
    async (job: MediaJob, successMessage = `${job.title} downloaded.`) => {
      try {
        await downloadMediaJobOutput(job.id);
        toast.success(successMessage);
      } catch {
        toast.error("The file is ready, but the download failed.");
      }
    },
    [],
  );

  return {
    apiOnline,
    commandJob,
    downloadJob,
    jobs,
    loadJobs,
    setApiOnline,
    setJobs,
  };
}
