import { describe, expect, it } from 'vitest';
import { formatItemJobNotificationSummary } from './format-item-job-notification-summary.util';

describe('formatItemJobNotificationSummary', () => {
  it('formats enrich success with hostname label', () => {
    expect(
      formatItemJobNotificationSummary({
        Kind: 'item-enrich',
        Status: 'completed',
        Error: null,
        Message: 'Info grabbed',
        Payload: { url: 'https://www.store.example/item/1' },
      })
    ).toEqual({
      title: 'Item ready',
      message: 'Finished processing “store.example”.',
      tone: 'success',
    });
  });

  it('formats summarize failure with error text', () => {
    expect(
      formatItemJobNotificationSummary({
        Kind: 'item-summarize',
        Status: 'failed',
        Error: 'Model unavailable',
        Message: '',
      })
    ).toEqual({
      title: 'Summarize failed',
      message: 'Model unavailable',
      tone: 'error',
    });
  });
});
