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

  it('formats enrich soft-fail when AiPopulate failed', () => {
    expect(
      formatItemJobNotificationSummary(
        {
          Kind: 'item-enrich',
          Status: 'completed',
          Error: null,
          Message: 'Info grabbed',
          Result: {
            Title: 'Wireless Mouse',
            Diagnostics: { AiPopulate: 'failed' },
          },
        },
        { listTitle: 'Office Gifts' }
      )
    ).toEqual({
      title: 'Office Gifts',
      message:
        'Product details were found, but AI summarization has failed for “Wireless Mouse”.',
      tone: 'info',
    });
  });

  it('formats enrich soft-fail without label', () => {
    expect(
      formatItemJobNotificationSummary({
        Kind: 'item-enrich',
        Status: 'completed',
        Error: null,
        Message: 'Info grabbed',
        Result: { Diagnostics: { AiPopulate: 'failed' } },
      })
    ).toEqual({
      title: 'Item ready',
      message: 'Product details were found, but AI summarization has failed.',
      tone: 'info',
    });
  });
});
