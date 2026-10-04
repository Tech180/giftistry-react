import { describe, expect, test } from 'vitest';
import type { ResolveApplyBarButtonLabelInput } from '../interfaces/resolve-apply-bar-button-label-input.interface';
import { resolveApplyBarButtonLabel } from './resolve-apply-bar-button-label.util';

const base: ResolveApplyBarButtonLabelInput = {
  collapseDrawerWhileTagging: false,
  isItemFormSessionActive: false,
  isLinkingModeActive: false,
  isRelatingModeActive: false,
  isReplyTaggingModeActive: false,
  taggedItemIds: [],
  replyTaggedItemIds: [],
};

describe('resolveApplyBarButtonLabel', () => {
  test('returns Cancel when tagging overlay is active with no tags', () => {
    expect(
      resolveApplyBarButtonLabel({
        ...base,
        collapseDrawerWhileTagging: true,
      })
    ).toBe('Cancel');
  });

  test('returns Apply when tagging overlay has selected tags', () => {
    expect(
      resolveApplyBarButtonLabel({
        ...base,
        collapseDrawerWhileTagging: true,
        taggedItemIds: ['item-1'],
      })
    ).toBe('Apply');
  });

  test('returns Cancel for reply tagging with no tags', () => {
    expect(
      resolveApplyBarButtonLabel({
        ...base,
        collapseDrawerWhileTagging: true,
        isReplyTaggingModeActive: true,
        replyTaggedItemIds: [],
      })
    ).toBe('Cancel');
  });

  test('returns Apply for reply tagging with selected tags', () => {
    expect(
      resolveApplyBarButtonLabel({
        ...base,
        collapseDrawerWhileTagging: true,
        isReplyTaggingModeActive: true,
        replyTaggedItemIds: ['item-2'],
      })
    ).toBe('Apply');
  });

  test('returns Apply for link mode even when tag arrays are empty', () => {
    expect(
      resolveApplyBarButtonLabel({
        ...base,
        isItemFormSessionActive: true,
        isLinkingModeActive: true,
        collapseDrawerWhileTagging: true,
      })
    ).toBe('Apply');
  });
});
