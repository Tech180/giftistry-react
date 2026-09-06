import { describe, expect, test } from 'vitest';
import {
  getGroupFundContributorUserIds,
  shouldRevealAnonymousClaimToViewer,
} from './group-fund-anonymous-visibility.util';

describe('group-fund anonymous visibility', () => {
  test('fellow contributors reveal each other', () => {
    const claims = [
      { UserId: 'user-a', Amount: 30, Anonymous: true },
      { UserId: 'user-b', Amount: 19.99, Anonymous: true },
    ];
    const contributorIds = getGroupFundContributorUserIds(claims);

    expect(
      shouldRevealAnonymousClaimToViewer(
        { UserId: 'user-a', Amount: 30, Anonymous: true },
        'user-b',
        contributorIds
      )
    ).toBe(true);
  });

  test('non-contributors do not reveal anonymous GF claims', () => {
    const claims = [{ UserId: 'user-a', Amount: 30, Anonymous: true }];
    const contributorIds = getGroupFundContributorUserIds(claims);

    expect(
      shouldRevealAnonymousClaimToViewer(
        { UserId: 'user-a', Amount: 30, Anonymous: true },
        'viewer-c',
        contributorIds
      )
    ).toBe(false);
  });
});
