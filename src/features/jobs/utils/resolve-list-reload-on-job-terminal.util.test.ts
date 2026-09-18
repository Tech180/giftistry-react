import { describe, expect, test } from 'vitest';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import { resolveListReloadOnJobTerminal } from './resolve-list-reload-on-job-terminal.util';

function job(partial: Partial<BackgroundJobView> & Pick<BackgroundJobView, 'Kind'>): BackgroundJobView {
  return {
    Id: 'job-1',
    ListId: 'list-1',
    UserId: 'user-1',
    Status: 'completed',
    Phase: 'completed',
    ProgressDone: 1,
    ProgressTotal: 1,
    Message: 'done',
    Error: null,
    ...partial,
  };
}

describe('resolveListReloadOnJobTerminal', () => {
  test('draft-populate enrich skips reload', () => {
    expect(
      resolveListReloadOnJobTerminal(
        job({ Kind: 'item-enrich', Intent: 'draft-populate', WriteBack: false })
      )
    ).toBe('none');
  });

  test('summarize without write-back skips reload', () => {
    expect(
      resolveListReloadOnJobTerminal(job({ Kind: 'item-summarize', WriteBack: false }))
    ).toBe('none');
  });

  test('update-item enrich soft-reloads items', () => {
    expect(
      resolveListReloadOnJobTerminal(
        job({ Kind: 'item-enrich', Intent: 'update-item', WriteBack: true })
      )
    ).toBe('items');
  });

  test('create-from-url enrich soft-reloads items', () => {
    expect(
      resolveListReloadOnJobTerminal(
        job({ Kind: 'item-enrich', Intent: 'create-from-url', WriteBack: true })
      )
    ).toBe('items');
  });

  test('enrich without WriteBack soft-reloads items', () => {
    expect(resolveListReloadOnJobTerminal(job({ Kind: 'item-enrich' }))).toBe('items');
  });

  test('summarize with write-back soft-reloads items', () => {
    expect(
      resolveListReloadOnJobTerminal(job({ Kind: 'item-summarize', WriteBack: true }))
    ).toBe('items');
  });

  test('wishlist-import uses full reload', () => {
    expect(resolveListReloadOnJobTerminal(job({ Kind: 'wishlist-import' }))).toBe('full');
  });
});
