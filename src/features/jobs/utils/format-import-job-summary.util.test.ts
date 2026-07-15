import { describe, expect, test } from 'vitest';
import { formatImportJobSummary } from './format-import-job-summary.util';
import type { BackgroundJobView } from '../interfaces/background-job.interface';

function job(partial: Partial<BackgroundJobView>): BackgroundJobView {
  return {
    Id: 'job-1',
    Kind: 'wishlist-import',
    ListId: 'list-1',
    UserId: 'user-1',
    Status: 'completed',
    Phase: 'completed',
    ProgressDone: 10,
    ProgressTotal: 10,
    Message: 'Import finished',
    Error: null,
    ...partial,
  };
}

describe('formatImportJobSummary', () => {
  test('includes created count on success', () => {
    const summary = formatImportJobSummary(
      job({ Result: { Created: 120, Failed: 0, GrabFailed: 0 } })
    );
    expect(summary.title).toBe('Import complete');
    expect(summary.message).toBe('Import finished — 120 items added');
    expect(summary.tone).toBe('success');
  });

  test('includes grab failure count with info tone', () => {
    const summary = formatImportJobSummary(
      job({ Result: { Created: 120, Failed: 0, GrabFailed: 85 } })
    );
    expect(summary.message).toBe(
      'Import finished — 120 items added, 85 grab failures'
    );
    expect(summary.tone).toBe('info');
  });

  test('formats failed and cancelled jobs', () => {
    expect(
      formatImportJobSummary(job({ Status: 'failed', Error: 'parse boom' })).message
    ).toBe('parse boom');
    expect(
      formatImportJobSummary(job({ Status: 'cancelled' })).title
    ).toBe('Import cancelled');
  });
});
