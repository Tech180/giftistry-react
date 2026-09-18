import { describe, expect, it } from 'vitest';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import { formatJobTerminalSummary } from './format-job-summary.util';

function job(overrides: Partial<BackgroundJobView> = {}): BackgroundJobView {
  return {
    Id: 'job-1',
    Kind: 'item-enrich',
    ListId: 'list-1',
    UserId: 'user-1',
    Status: 'completed',
    Phase: 'completed',
    ProgressDone: 1,
    ProgressTotal: 1,
    Message: 'done',
    Error: null,
    ...overrides,
  };
}

describe('formatJobTerminalSummary', () => {
  it('returns null for successful enrich', () => {
    expect(formatJobTerminalSummary(job())).toBeNull();
  });

  it('returns error summary for failed enrich', () => {
    expect(
      formatJobTerminalSummary(job({ Status: 'failed', Error: 'Timeout', Phase: 'failed' }))
    ).toEqual({
      title: 'Auto-fill failed',
      message: 'Timeout',
      tone: 'error',
    });
  });

  it('returns info summary when enrich completed but AiPopulate failed', () => {
    expect(
      formatJobTerminalSummary(
        job({
          Result: {
            Title: 'DAC Amp',
            Diagnostics: { AiPopulate: 'failed' },
          },
        })
      )
    ).toEqual({
      title: 'Item ready',
      message: 'Product details were found, but AI summarization has failed for “DAC Amp”.',
      tone: 'info',
    });
  });

  it('returns null for successful summarize', () => {
    expect(formatJobTerminalSummary(job({ Kind: 'item-summarize' }))).toBeNull();
  });
});
