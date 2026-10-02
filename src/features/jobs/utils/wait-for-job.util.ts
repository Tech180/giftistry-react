import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { WaitForJobOptions } from '../interfaces/wait-for-job-options.interface';
import {
  DEFAULT_JOB_POLL_INTERVAL_MS,
  JOB_WAIT_SAFETY_POLL_INTERVAL_MS,
  TERMINAL_JOB_STATUSES,
} from '../constants/job.constants';

const JOB_SOCKET_EVENT_TYPES = ['job.progress', 'job.completed', 'job.failed'] as const;

export function isTerminalJobStatus(status: BackgroundJobView['Status'] | undefined): boolean {
  return !!status && TERMINAL_JOB_STATUSES.includes(status);
}

function jobFromSocketPayload(data: unknown): BackgroundJobView | undefined {
  if (!data || typeof data !== 'object' || !('Job' in data)) {
    return undefined;
  }
  return (data as { Job?: BackgroundJobView }).Job;
}

async function waitForJobViaPoll(
  jobId: string,
  options: WaitForJobOptions
): Promise<BackgroundJobView | null> {
  const intervalMs = options.intervalMs ?? DEFAULT_JOB_POLL_INTERVAL_MS;

  while (!options.isCancelled?.()) {
    const job = await jobsApi.getJob(jobId);
    if (isTerminalJobStatus(job?.Status)) {
      return job;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return null;
}

async function waitForJobViaSocket(
  jobId: string,
  options: WaitForJobOptions & {
    subscribe: (type: string, handler: (data: unknown) => void) => void;
    unsubscribe: (type: string, handler: (data: unknown) => void) => void;
  }
): Promise<BackgroundJobView | null> {
  const safetyIntervalMs = options.intervalMs ?? JOB_WAIT_SAFETY_POLL_INTERVAL_MS;

  return new Promise((resolve) => {
    let settled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const settle = (job: BackgroundJobView | null) => {
      if (settled) {
        return;
      }
      settled = true;
      if (pollTimer !== null) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      for (const type of JOB_SOCKET_EVENT_TYPES) {
        options.unsubscribe(type, handleJobUpdate);
      }
      resolve(job);
    };

    const handleJobUpdate = (data: unknown) => {
      if (options.isCancelled?.()) {
        settle(null);
        return;
      }
      const job = jobFromSocketPayload(data);
      if (!job || job.Id !== jobId) {
        return;
      }
      if (isTerminalJobStatus(job.Status)) {
        settle(job);
      }
    };

    const checkHttp = async () => {
      if (settled) {
        return;
      }
      if (options.isCancelled?.()) {
        settle(null);
        return;
      }
      try {
        const job = await jobsApi.getJob(jobId);
        if (settled) {
          return;
        }
        if (options.isCancelled?.()) {
          settle(null);
          return;
        }
        if (isTerminalJobStatus(job?.Status)) {
          settle(job);
        }
      } catch {
        /* keep waiting on socket / next poll */
      }
    };

    for (const type of JOB_SOCKET_EVENT_TYPES) {
      options.subscribe(type, handleJobUpdate);
    }

    if (options.isCancelled?.()) {
      settle(null);
      return;
    }

    void checkHttp();
    pollTimer = setInterval(() => {
      void checkHttp();
    }, safetyIntervalMs);
  });
}

/**
 * Waits until a job reaches a terminal status. Resolves `null` when the
 * caller cancels (component unmounted, panel closed, …).
 *
 * When `subscribe` / `unsubscribe` are provided (typically from
 * `useUserSocket`), prefers socket events with an immediate `getJob` and a
 * sparse safety poll. Otherwise falls back to aggressive HTTP polling.
 */
export async function waitForJob(
  jobId: string,
  options: WaitForJobOptions = {}
): Promise<BackgroundJobView | null> {
  if (options.subscribe && options.unsubscribe) {
    return waitForJobViaSocket(jobId, {
      ...options,
      subscribe: options.subscribe,
      unsubscribe: options.unsubscribe,
    });
  }

  return waitForJobViaPoll(jobId, options);
}
