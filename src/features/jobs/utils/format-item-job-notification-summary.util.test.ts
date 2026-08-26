import { describe, expect, it } from 'vitest';
import { formatItemJobNotificationSummary } from './format-item-job-notification-summary.util';

describe('formatItemJobNotificationSummary', () => {
  it('formats enrich success with list title and Result.Title', () => {
    expect(
      formatItemJobNotificationSummary(
        {
          Kind: 'item-enrich',
          Status: 'completed',
          Error: null,
          Message: 'Info grabbed',
          Payload: { url: 'https://www.store.example/item/1' },
          Result: { Title: 'Wireless Mouse' },
        },
        { listTitle: 'Office Gifts' }
      )
    ).toEqual({
      title: 'Office Gifts',
      message: 'Finished processing “Wireless Mouse”.',
      tone: 'success',
    });
  });

  it('does not use hostname when only URL is present', () => {
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
      message: 'Finished processing your item.',
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
