import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCommentWsUrl } from 'features/comments/utils/comment-ws.util';
import { jobsApi } from '../api/jobs.api';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import { getEnrichingItemIds } from '../utils/get-enriching-item-ids.util';

/** Kinds whose active streams map onto item cards that should show a skeleton. */
const ITEM_STREAM_KINDS = new Set(['item-enrich', 'wishlist-import']);

function isActiveStatus(status: string | undefined): boolean {
  return status === 'queued' || status === 'running';
}

export function useWishlistJob(listId: string | undefined) {
  const [job, setJob] = useState<BackgroundJobView | null>(null);
  const [activeJobs, setActiveJobs] = useState<Record<string, BackgroundJobView>>({});
  const [error, setError] = useState<string | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  // Jobs arrive from two independent channels, so accumulate them by id instead
  // of replacing: a WS frame for job B must not drop job A's in-flight streams.
  const trackJob = useCallback((next: BackgroundJobView | null) => {
    if (!next?.Id) return;
    setActiveJobs((prev) => {
      if (isActiveStatus(next.Status)) {
        return { ...prev, [next.Id]: next };
      }
      if (!prev[next.Id]) return prev;
      const remaining = { ...prev };
      delete remaining[next.Id];
      return remaining;
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!listId) return null;
    try {
      const active = await jobsApi.getActiveForList(listId);
      setJob(active);
      trackJob(active);
      jobIdRef.current = active?.Id ?? null;
      setError(null);
      return active;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
      return null;
    }
  }, [listId, trackJob]);

  const cancel = useCallback(async () => {
    const id = jobIdRef.current;
    if (!id) return;
    const updated = await jobsApi.cancelJob(id);
    setJob(updated);
    trackJob(updated);
  }, [trackJob]);

  useEffect(() => {
    if (!listId) {
      setJob(null);
      setActiveJobs({});
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
              trackJob(data.Job);
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
  }, [listId, refresh, trackJob]);

  const enrichingItemIds = useMemo(() => {
    const itemIds = new Set<string>();
    for (const activeJob of Object.values(activeJobs)) {
      if (!ITEM_STREAM_KINDS.has(activeJob.Kind)) continue;
      for (const itemId of getEnrichingItemIds(activeJob)) {
        itemIds.add(itemId);
      }
    }
    return itemIds;
  }, [activeJobs]);

  return {
    job,
    error,
    refresh,
    cancel,
    enrichingItemIds,
    isActive: isActiveStatus(job?.Status) || Object.keys(activeJobs).length > 0,
  };
}
