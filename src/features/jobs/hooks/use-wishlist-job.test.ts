import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWishlistJob } from './use-wishlist-job';

vi.mock('../api/jobs.api', () => ({
  jobsApi: {
    getActiveForList: vi.fn(),
    getJob: vi.fn(),
    cancelJob: vi.fn(),
  },
}));

vi.mock('features/comments/utils/comment-ws.util', () => ({
  getCommentWsUrl: () => 'ws://localhost/ws/wishlist/list-1',
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  onmessage: ((event: { data: string }) => void) | null = null;
  close = vi.fn();
  constructor(public url: string) {
    MockWebSocket.instances.push(this);
  }
}

import { jobsApi } from '../api/jobs.api';

describe('useWishlistJob', () => {
  const originalWebSocket = globalThis.WebSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    MockWebSocket.instances = [];
    // @ts-expect-error mock socket
    globalThis.WebSocket = MockWebSocket;
  });

  afterEach(() => {
    globalThis.WebSocket = originalWebSocket;
  });

  test('loads active job and applies WS progress updates', async () => {
    vi.mocked(jobsApi.getActiveForList).mockResolvedValue({
      Id: 'job-1',
      Kind: 'wishlist-import',
      ListId: 'list-1',
      UserId: 'u',
      Status: 'running',
      Phase: 'adding_items',
      ProgressDone: 1,
      ProgressTotal: 3,
      Message: 'Adding',
      Error: null,
    });

    const { result } = renderHook(() => useWishlistJob('list-1'));

    await waitFor(() => {
      expect(result.current.job?.Id).toBe('job-1');
    });

    const socket = MockWebSocket.instances[0];
    act(() => {
      socket.onmessage?.({
        data: JSON.stringify({
          Type: 'job.progress',
          Job: {
            Id: 'job-1',
            Kind: 'wishlist-import',
            ListId: 'list-1',
            UserId: 'u',
            Status: 'running',
            Phase: 'grabbing_info',
            ProgressDone: 2,
            ProgressTotal: 3,
            Message: 'Grabbing',
            Error: null,
          },
        }),
      });
    });

    expect(result.current.job?.Phase).toBe('grabbing_info');
    expect(result.current.isActive).toBe(true);
  });

  test('accumulates enriching item ids across concurrent jobs', async () => {
    vi.mocked(jobsApi.getActiveForList).mockResolvedValue({
      Id: 'job-import',
      Kind: 'wishlist-import',
      ListId: 'list-1',
      UserId: 'u',
      Status: 'running',
      Phase: 'grabbing_info',
      ProgressDone: 1,
      ProgressTotal: 2,
      Message: 'Grabbing',
      Error: null,
      ActiveStreams: [
        { Id: 's1', ItemId: 'item-1', Label: 'One', Status: 'running' },
        { Id: 's2', ItemId: 'item-2', Label: 'Two', Status: 'done' },
      ],
    });

    const { result } = renderHook(() => useWishlistJob('list-1'));

    await waitFor(() => {
      expect([...result.current.enrichingItemIds]).toEqual(['item-1']);
    });

    const socket = MockWebSocket.instances[0];
    const enrichJob = {
      Id: 'job-enrich',
      Kind: 'item-enrich',
      ListId: 'list-1',
      UserId: 'u',
      Status: 'running',
      Phase: 'grabbing_info',
      ProgressDone: 0,
      ProgressTotal: 1,
      Message: 'Enriching',
      Error: null,
      ActiveStreams: [{ Id: 's3', ItemId: 'item-9', Label: 'Nine', Status: 'pending' }],
    };

    act(() => {
      socket.onmessage?.({ data: JSON.stringify({ Type: 'job.progress', Job: enrichJob }) });
    });

    // The import job's streams must survive an unrelated job's WS frame.
    expect([...result.current.enrichingItemIds].sort()).toEqual(['item-1', 'item-9']);

    act(() => {
      socket.onmessage?.({
        data: JSON.stringify({
          Type: 'job.completed',
          Job: { ...enrichJob, Status: 'completed', ActiveStreams: [] },
        }),
      });
    });

    expect([...result.current.enrichingItemIds]).toEqual(['item-1']);
    expect(result.current.isActive).toBe(true);
  });
});
