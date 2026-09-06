import { describe, expect, test } from 'vitest';
import {
  claimGroupFundLeftover,
  isClaimGroupFundPathActive,
  resolveClaimGroupFundAmount,
} from './resolve-claim-group-fund-amount.util';

describe('resolveClaimGroupFundAmount', () => {
  test('returns null when group funding is disabled on the list', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: false,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        groupFundingEnabled: true,
        amount: 40,
      })
    ).toBeNull();
  });

  test('returns null when toggle is off and no prior funding', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        groupFundingEnabled: false,
        amount: 40,
      })
    ).toBeNull();
  });

  test('rewrites full amount with no priors to exclusive null', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        groupFundingEnabled: true,
        amount: 100,
      })
    ).toBeNull();
  });

  test('starts group funding with a partial amount', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        groupFundingEnabled: true,
        amount: 40,
      })
    ).toBe(40);
  });

  test('allows finishing leftover after group funding started', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 60,
        groupFundingEnabled: true,
        amount: 40,
      })
    ).toBe(40);
  });

  test('caps amount to leftover', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 70,
        groupFundingEnabled: true,
        amount: 50,
      })
    ).toBe(30);
  });

  test('allows finishing when leftover is affected by float drift', () => {
    expect(
      resolveClaimGroupFundAmount({
        allowGroupFunds: true,
        fundingTarget: 49.99,
        totalClaimedAmount: 30,
        groupFundingEnabled: true,
        amount: 19.99,
      })
    ).toBe(19.99);
  });
});

describe('claimGroupFundLeftover', () => {
  test('computes remaining', () => {
    expect(claimGroupFundLeftover(100, 35)).toBe(65);
  });

  test('returns zero when float drift meets target', () => {
    expect(claimGroupFundLeftover(49.99, 30 + 19.99)).toBe(0);
  });
});

describe('isClaimGroupFundPathActive', () => {
  test('forced on when prior funding exists', () => {
    expect(
      isClaimGroupFundPathActive({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 10,
        multiCount: false,
        groupFundingEnabled: false,
      })
    ).toBe(true);
  });

  test('hidden for multi-count', () => {
    expect(
      isClaimGroupFundPathActive({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        multiCount: true,
        groupFundingEnabled: true,
      })
    ).toBe(false);
  });
});
