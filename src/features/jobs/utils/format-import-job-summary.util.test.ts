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

  test('appends parse Warnings with info tone', () => {
    const summary = formatImportJobSummary(
      job({
        Result: {
          Created: 2,
          Failed: 0,
          Warnings: ['AI returned only 2 items from ~40 rows; results may be incomplete.'],
        },
      })
    );
    expect(summary.message).toContain('2 items added');
    expect(summary.message).toContain('only 2 items from ~40 rows');
    expect(summary.tone).toBe('info');
  });

  test('appends chunk failure Warnings with info tone', () => {
    const summary = formatImportJobSummary(
      job({
        Result: {
          Created: 10,
          Failed: 0,
          Warnings: [
            '1 of 3 AI import chunks failed; results may be incomplete.',
          ],
        },
      })
    );
    expect(summary.message).toContain('10 items added');
    expect(summary.message).toContain('1 of 3 AI import chunks failed');
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
