import { useCallback, useEffect, useState } from 'react';
import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { BackgroundJobsScope } from '../interfaces/background-jobs-scope.type';
import type { JobSocketUpdate } from '../interfaces/job-socket-update.interface';
import { useUserSocket } from 'shared/providers/user-socket';

export function useBackgroundJobs(scope: BackgroundJobsScope) {
  const [jobs, setJobs] = useState<BackgroundJobView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addEventListener, removeEventListener } = useUserSocket();

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

    if (scope === 'mine') {
      const handleJobUpdate = (data: unknown) => {
        const payload = data as JobSocketUpdate;
        if (payload?.Job) {
          const nextJob = payload.Job;
          setJobs((prev) => {
            const exists = prev.some((j) => j.Id === nextJob.Id);
            if (exists) {
              return prev.map((j) => (j.Id === nextJob.Id ? nextJob : j));
            }
            return [nextJob, ...prev];
          });
        }
      };

      addEventListener('job.progress', handleJobUpdate);
      addEventListener('job.completed', handleJobUpdate);
      addEventListener('job.failed', handleJobUpdate);

      return () => {
        removeEventListener('job.progress', handleJobUpdate);
        removeEventListener('job.completed', handleJobUpdate);
        removeEventListener('job.failed', handleJobUpdate);
      };
    }

    const id = window.setInterval(() => {
      void refresh();
    }, 10000);
    return () => window.clearInterval(id);
  }, [refresh, scope, addEventListener, removeEventListener]);

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
