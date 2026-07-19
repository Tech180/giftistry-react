import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../api/jobs.api', () => ({
  jobsApi: {
    listMine: vi.fn(),
    listAdmin: vi.fn(),
    cancelJob: vi.fn(),
    suspendJob: vi.fn(),
    resumeJob: vi.fn(),
    adminCancelJob: vi.fn(),
    adminSuspendJob: vi.fn(),
    adminResumeJob: vi.fn(),
  },
}));

vi.mock('app/providers/user-socket-context', () => ({
  useUserSocket: () => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    isConnected: true,
  }),
}));

import { useBackgroundJobs } from './use-background-jobs';
import { jobsApi } from '../api/jobs.api';

const sampleJob = {
  Id: 'job-1',
  Kind: 'wishlist-import',
  ListId: 'list-1',
  UserId: 'user-1',
  Status: 'running' as const,
  Phase: 'grabbing_info' as const,
  ProgressDone: 1,
  ProgressTotal: 2,
  Message: 'Working',
  Error: null,
};

describe('useBackgroundJobs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('loads jobs from listMine', async () => {
    vi.mocked(jobsApi.listMine).mockResolvedValue([sampleJob]);

    const { result } = renderHook(() => useBackgroundJobs('mine'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([sampleJob]);
    expect(result.current.error).toBeNull();
  });

  test('surfaces load errors', async () => {
    vi.mocked(jobsApi.listMine).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useBackgroundJobs('mine'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
    expect(result.current.error).toBe('boom');
  });
});
