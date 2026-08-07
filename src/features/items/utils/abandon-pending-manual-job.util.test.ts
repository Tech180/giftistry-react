import { beforeEach, describe, expect, test, vi } from 'vitest';
import { jobsApi } from 'features/jobs/api/jobs.api';
import { abandonPendingManualJob } from './abandon-pending-manual-job.util';

vi.mock('features/jobs/api/jobs.api', () => ({
  jobsApi: {
    cancelJob: vi.fn(),
    startItemEnrich: vi.fn(),
  },
}));

describe('abandonPendingManualJob', () => {
  beforeEach(() => {
    vi.mocked(jobsApi.cancelJob).mockReset();
    vi.mocked(jobsApi.startItemEnrich).mockReset();
    vi.mocked(jobsApi.cancelJob).mockResolvedValue({} as never);
    vi.mocked(jobsApi.startItemEnrich).mockResolvedValue({
      Job: { Id: 'new-job' },
    } as never);
  });

  test('noops when nothing is pending', async () => {
    await expect(
      abandonPendingManualJob({ pending: null, listId: 'list-1', background: true })
    ).resolves.toEqual({ outcome: 'noop' });
    expect(jobsApi.cancelJob).not.toHaveBeenCalled();
    expect(jobsApi.startItemEnrich).not.toHaveBeenCalled();
  });

  test('foreground cancels any pending job', async () => {
    await expect(
      abandonPendingManualJob({
        pending: {
          jobId: 'job-1',
          kind: 'enrich',
          intent: 'draft-populate',
          url: 'https://example.com/a',
        },
        listId: 'list-1',
        background: false,
      })
    ).resolves.toEqual({ outcome: 'cancelled' });
    expect(jobsApi.cancelJob).toHaveBeenCalledWith('job-1');
    expect(jobsApi.startItemEnrich).not.toHaveBeenCalled();
  });

  test('background promotes draft-populate to create-from-url', async () => {
    const result = await abandonPendingManualJob({
      pending: {
        jobId: 'job-1',
        kind: 'enrich',
        intent: 'draft-populate',
        url: 'https://example.com/a',
      },
      listId: 'list-1',
      background: true,
    });

    expect(jobsApi.cancelJob).toHaveBeenCalledWith('job-1');
    expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
      intent: 'create-from-url',
      listId: 'list-1',
      url: 'https://example.com/a',
      writeBack: true,
    });
    expect(result.outcome).toBe('promoted');
    expect(result.result?.Job.Id).toBe('new-job');
  });

  test('background leaves update-item running', async () => {
    await expect(
      abandonPendingManualJob({
        pending: {
          jobId: 'job-2',
          kind: 'enrich',
          intent: 'update-item',
          url: 'https://example.com/a',
        },
        listId: 'list-1',
        background: true,
      })
    ).resolves.toEqual({ outcome: 'left' });
    expect(jobsApi.cancelJob).not.toHaveBeenCalled();
    expect(jobsApi.startItemEnrich).not.toHaveBeenCalled();
  });

  test('background leaves summarize running', async () => {
    await expect(
      abandonPendingManualJob({
        pending: { jobId: 'job-3', kind: 'summarize' },
        listId: 'list-1',
        background: true,
      })
    ).resolves.toEqual({ outcome: 'left' });
    expect(jobsApi.cancelJob).not.toHaveBeenCalled();
  });
});
