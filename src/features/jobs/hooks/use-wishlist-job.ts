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
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

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
  }, []);

  useEffect(() => {
    if (!listId) {
      setJob(null);
      jobIdRef.current = null;
      return;
    }

    void refresh();

    let isCleanup = false;

    const connect = () => {
      if (socketRef.current || isCleanup) return;

      try {
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

        socket.onclose = () => {
          socketRef.current = null;
          if (!isCleanup) {
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
          }
        };

        socket.onerror = () => {
          // Let the browser transition to closed state naturally, onclose will handle retry
        };
      } catch (err) {
        console.error('Error establishing job websocket connection:', err);
        if (!isCleanup) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isCleanup = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        const socket = socketRef.current;
        socket.onopen = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
        socketRef.current = null;
      }
    };
  }, [listId, refresh]);

  return {
    job,
    error,
    refresh,
    cancel,
    isActive: isActiveStatus(job?.Status),
  };
}
