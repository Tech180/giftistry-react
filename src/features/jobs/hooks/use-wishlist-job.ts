import { useCallback, useEffect, useRef, useState } from 'react';
import { getCommentWsUrl } from 'features/comments/utils/comment-ws.util';
import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';

function isActiveStatus(status: string | undefined): boolean {
  return status === 'queued' || status === 'running';
}

export function useWishlistJob(listId: string | undefined) {
  const [job, setJob] = useState<BackgroundJobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!listId) return null;
    try {
      const active = await jobsApi.getActiveForList(listId);
      setJob(active);
      jobIdRef.current = active?.Id ?? null;
      setError(null);
      return active;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
      return null;
    }
  }, [listId]);

  const cancel = useCallback(async () => {
    const id = jobIdRef.current;
    if (!id) return;
    const updated = await jobsApi.cancelJob(id);
    setJob(updated);
    if (!isActiveStatus(updated.Status)) {
      stopPolling();
    }
  }, [stopPolling]);

  useEffect(() => {
    if (!listId) {
      setJob(null);
      jobIdRef.current = null;
      return;
    }

    void refresh();

    const socket = new WebSocket(getCommentWsUrl(listId));
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(String(event.data)) as {
          Type?: string;
          Job?: BackgroundJobView;
        };
        if (
          (data.Type === 'job.progress' ||
            data.Type === 'job.completed' ||
            data.Type === 'job.failed') &&
          data.Job
        ) {
          setJob(data.Job);
          jobIdRef.current = data.Job.Id;
        }
      } catch {
        /* ignore malformed frames */
      }
    };

    pollRef.current = window.setInterval(() => {
      void (async () => {
        try {
          if (jobIdRef.current) {
            const latest = await jobsApi.getJob(jobIdRef.current);
            setJob(latest);
            if (!isActiveStatus(latest.Status)) {
              stopPolling();
            }
            return;
          }
          const active = await jobsApi.getActiveForList(listId);
          if (active) {
            setJob(active);
            jobIdRef.current = active.Id;
          }
        } catch {
          /* ignore transient poll errors */
        }
      })();
    }, 2000);

    return () => {
      stopPolling();
      socket.close();
      socketRef.current = null;
    };
  }, [listId, refresh, stopPolling]);

  return {
    job,
    error,
    refresh,
    cancel,
    isActive: isActiveStatus(job?.Status),
  };
}
