import { useCallback, useEffect, useState } from 'react';
import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';

export type BackgroundJobsScope = 'mine' | 'admin';

export function useBackgroundJobs(scope: BackgroundJobsScope) {
  const [jobs, setJobs] = useState<BackgroundJobView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = scope === 'admin' ? await jobsApi.listAdmin() : await jobsApi.listMine();
      setJobs(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, 2000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const cancel = useCallback(
    async (jobId: string) => {
      if (scope === 'admin') {
        await jobsApi.adminCancelJob(jobId);
      } else {
        await jobsApi.cancelJob(jobId);
      }
      await refresh();
    },
    [refresh, scope]
  );

  const suspend = useCallback(
    async (jobId: string) => {
      if (scope === 'admin') {
        await jobsApi.adminSuspendJob(jobId);
      } else {
        await jobsApi.suspendJob(jobId);
      }
      await refresh();
    },
    [refresh, scope]
  );

  const resume = useCallback(
    async (jobId: string) => {
      if (scope === 'admin') {
        await jobsApi.adminResumeJob(jobId);
      } else {
        await jobsApi.resumeJob(jobId);
      }
      await refresh();
    },
    [refresh, scope]
  );

  return { jobs, error, isLoading, refresh, cancel, suspend, resume };
}
