import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { WaitForJobOptions } from '../interfaces/wait-for-job-options.interface';
import {
  DEFAULT_JOB_POLL_INTERVAL_MS,
  TERMINAL_JOB_STATUSES,
} from '../constants/job.constants';

export function isTerminalJobStatus(status: BackgroundJobView['Status'] | undefined): boolean {
  return !!status && TERMINAL_JOB_STATUSES.includes(status);
}

/**
 * Polls a job until it reaches a terminal status. Resolves `null` when the
 * caller cancels (component unmounted, panel closed, …).
 */
export async function waitForJob(
  jobId: string,
  options: WaitForJobOptions = {}
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
