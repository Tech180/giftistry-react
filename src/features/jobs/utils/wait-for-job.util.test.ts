import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import { JOB_WAIT_SAFETY_POLL_INTERVAL_MS } from '../constants/job.constants';

vi.mock('../api/jobs.api', () => ({
  jobsApi: {
    getJob: vi.fn(),
  },
}));

import { jobsApi } from '../api/jobs.api';
import { waitForJob } from './wait-for-job.util';

function jobView(overrides: Partial<BackgroundJobView> = {}): BackgroundJobView {
  return {
    Id: 'job-1',
    Kind: 'item-enrich',
    ListId: 'list-1',
    UserId: 'user-1',
    Status: 'running',
    Phase: 'grabbing_info',
    ProgressDone: 0,
    ProgressTotal: 1,
    Message: 'Grabbing info…',
    Error: null,
    ...overrides,
  };
}

function createTransport() {
  const listeners = new Map<string, Set<(data: unknown) => void>>();

  const subscribe = (type: string, handler: (data: unknown) => void) => {
    const set = listeners.get(type) ?? new Set();
    set.add(handler);
    listeners.set(type, set);
  };

  const unsubscribe = (type: string, handler: (data: unknown) => void) => {
    listeners.get(type)?.delete(handler);
  };

  const emit = (type: string, data: unknown) => {
    for (const handler of listeners.get(type) ?? []) {
      handler(data);
    }
  };

  const listenerCount = (type: string) => listeners.get(type)?.size ?? 0;

  return { subscribe, unsubscribe, emit, listenerCount };
}

describe('waitForJob', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls over HTTP when no socket transport is provided', async () => {
    vi.mocked(jobsApi.getJob)
      .mockResolvedValueOnce(jobView({ Status: 'running' }))
      .mockResolvedValueOnce(jobView({ Status: 'completed', Phase: 'completed' }));

    const pending = waitForJob('job-1');
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(1500);
    const finished = await pending;

    expect(finished?.Status).toBe('completed');
    expect(jobsApi.getJob).toHaveBeenCalledTimes(2);
  });

  it('resolves from an immediate getJob when transport is provided', async () => {
    const transport = createTransport();
    vi.mocked(jobsApi.getJob).mockResolvedValue(
      jobView({ Status: 'completed', Phase: 'completed', Result: { Title: 'Done' } })
    );

    const finished = await waitForJob('job-1', {
      subscribe: transport.subscribe,
      unsubscribe: transport.unsubscribe,
    });

    expect(finished?.Status).toBe('completed');
    expect(finished?.Result).toEqual({ Title: 'Done' });
    expect(jobsApi.getJob).toHaveBeenCalledTimes(1);
    expect(transport.listenerCount('job.completed')).toBe(0);
  });

  it('resolves from a terminal socket event without waiting on the safety poll', async () => {
    const transport = createTransport();
    vi.mocked(jobsApi.getJob).mockResolvedValue(jobView({ Status: 'running' }));

    const pending = waitForJob('job-1', {
      subscribe: transport.subscribe,
      unsubscribe: transport.unsubscribe,
    });
    await vi.advanceTimersByTimeAsync(0);

    transport.emit('job.completed', {
      Type: 'job.completed',
      Job: jobView({ Status: 'completed', Phase: 'completed', Result: { Title: 'From socket' } }),
    });

    const finished = await pending;
    expect(finished?.Result).toEqual({ Title: 'From socket' });
    expect(jobsApi.getJob).toHaveBeenCalledTimes(1);
  });

  it('resolves from the safety poll when the socket stays quiet', async () => {
    const transport = createTransport();
    vi.mocked(jobsApi.getJob)
      .mockResolvedValueOnce(jobView({ Status: 'running' }))
      .mockResolvedValueOnce(
        jobView({ Status: 'completed', Phase: 'completed', Result: { Title: 'Polled' } })
      );

    const pending = waitForJob('job-1', {
      subscribe: transport.subscribe,
      unsubscribe: transport.unsubscribe,
    });
    await vi.advanceTimersByTimeAsync(0);
    expect(jobsApi.getJob).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(JOB_WAIT_SAFETY_POLL_INTERVAL_MS);
    const finished = await pending;

    expect(finished?.Result).toEqual({ Title: 'Polled' });
    expect(jobsApi.getJob).toHaveBeenCalledTimes(2);
  });

  it('returns null and unsubscribes when cancelled', async () => {
    const transport = createTransport();
    let cancelled = false;
    vi.mocked(jobsApi.getJob).mockResolvedValue(jobView({ Status: 'running' }));

    const pending = waitForJob('job-1', {
      isCancelled: () => cancelled,
      subscribe: transport.subscribe,
      unsubscribe: transport.unsubscribe,
    });
    await vi.advanceTimersByTimeAsync(0);

    cancelled = true;
    await vi.advanceTimersByTimeAsync(JOB_WAIT_SAFETY_POLL_INTERVAL_MS);
    const finished = await pending;

    expect(finished).toBeNull();
    expect(transport.listenerCount('job.progress')).toBe(0);
    expect(transport.listenerCount('job.completed')).toBe(0);
    expect(transport.listenerCount('job.failed')).toBe(0);
  });

  it('ignores socket events for other job ids', async () => {
    const transport = createTransport();
    vi.mocked(jobsApi.getJob)
      .mockResolvedValueOnce(jobView({ Status: 'running' }))
      .mockResolvedValueOnce(jobView({ Status: 'completed', Phase: 'completed' }));

    const pending = waitForJob('job-1', {
      subscribe: transport.subscribe,
      unsubscribe: transport.unsubscribe,
    });
    await vi.advanceTimersByTimeAsync(0);

    transport.emit('job.completed', {
      Type: 'job.completed',
      Job: jobView({ Id: 'other-job', Status: 'completed', Phase: 'completed' }),
    });

    await vi.advanceTimersByTimeAsync(JOB_WAIT_SAFETY_POLL_INTERVAL_MS);
    const finished = await pending;
    expect(finished?.Id).toBe('job-1');
  });
});
