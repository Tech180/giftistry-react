import {
  resolveClaimBadgeEntries,
  shouldShowClaimBadgeEntries,
} from './resolve-claim-badge-entries.util';

describe('resolveClaimBadgeEntries', () => {
  it('dedupes named claimants by user id', () => {
    expect(
      resolveClaimBadgeEntries([
        {
          Id: '1',
          UserId: 'user-1',
          ClaimedByName: 'Jamie Lee',
          Anonymous: false,
        },
        {
          Id: '2',
          UserId: 'user-1',
          ClaimedByName: 'Jamie Lee',
          Anonymous: false,
        },
        {
          Id: '3',
          UserId: 'user-2',
          ClaimedByName: 'Alex Kim',
          Anonymous: false,
        },
      ])
    ).toEqual([
      {
        key: 'user-1',
        userId: 'user-1',
        displayName: 'Jamie Lee',
        anonymous: false,
      },
      {
        key: 'user-2',
        userId: 'user-2',
        displayName: 'Alex Kim',
        anonymous: false,
      },
    ]);
  });

  it('consolidates multiple anonymous claims into one entry', () => {
    expect(
      resolveClaimBadgeEntries([
        {
          Id: '1',
          UserId: null,
          ClaimedByName: 'Anonymous',
          Anonymous: true,
        },
        {
          Id: '2',
          UserId: 'user-9',
          ClaimedByName: 'Anonymous',
          Anonymous: true,
        },
        {
          Id: '3',
          UserId: null,
          ClaimedByName: 'Anonymous',
          Anonymous: true,
        },
      ])
    ).toEqual([
      {
        key: 'anonymous',
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      },
    ]);
  });

  it('lists named claimants then a single anonymous chip', () => {
    expect(
      resolveClaimBadgeEntries([
        {
          Id: '1',
          UserId: 'user-1',
          ClaimedByName: 'Jamie Lee',
          Anonymous: false,
        },
        {
          Id: '2',
          UserId: null,
          ClaimedByName: 'Anonymous',
          Anonymous: true,
        },
        {
          Id: '3',
          UserId: 'user-2',
          ClaimedByName: 'Alex Kim',
          Anonymous: false,
        },
      ])
    ).toEqual([
      {
        key: 'user-1',
        userId: 'user-1',
        displayName: 'Jamie Lee',
        anonymous: false,
      },
      {
        key: 'user-2',
        userId: 'user-2',
        displayName: 'Alex Kim',
        anonymous: false,
      },
      {
        key: 'anonymous',
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      },
    ]);
  });

  it('shows the current user avatar with anonymous marker instead of the chip', () => {
    expect(
      resolveClaimBadgeEntries(
        [
          {
            Id: '1',
            UserId: 'user-1',
            ClaimedByName: 'Anonymous',
            Anonymous: true,
          },
          {
            Id: '2',
            UserId: 'user-2',
            ClaimedByName: 'Alex Kim',
            Anonymous: false,
          },
        ],
        'user-1',
        'Jamie Lee'
      )
    ).toEqual([
      {
        key: 'user-1',
        userId: 'user-1',
        displayName: 'Jamie Lee',
        anonymous: false,
        anonymousMarker: true,
      },
      {
        key: 'user-2',
        userId: 'user-2',
        displayName: 'Alex Kim',
        anonymous: false,
      },
    ]);
  });

  it('keeps other anonymous claims as a chip beside the current user marker', () => {
    expect(
      resolveClaimBadgeEntries(
        [
          {
            Id: '1',
            UserId: 'user-1',
            ClaimedByName: 'Anonymous',
            Anonymous: true,
          },
          {
            Id: '2',
            UserId: null,
            ClaimedByName: 'Anonymous',
            Anonymous: true,
          },
        ],
        'user-1',
        'Jamie Lee'
      )
    ).toEqual([
      {
        key: 'user-1',
        userId: 'user-1',
        displayName: 'Jamie Lee',
        anonymous: false,
        anonymousMarker: true,
      },
      {
        key: 'anonymous',
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      },
    ]);
  });

  it('hides the current user identity from other viewers of anonymous claims', () => {
    expect(
      resolveClaimBadgeEntries(
        [
          {
            Id: '1',
            UserId: 'user-1',
            ClaimedByName: 'Anonymous',
            Anonymous: true,
          },
        ],
        'user-2',
        'Alex Kim'
      )
    ).toEqual([
      {
        key: 'anonymous',
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      },
    ]);
  });

  it('returns empty array when there are no claims', () => {
    expect(resolveClaimBadgeEntries([])).toEqual([]);
  });
});

describe('shouldShowClaimBadgeEntries', () => {
  const jamie = {
    key: 'user-1',
    userId: 'user-1',
    displayName: 'Jamie',
    anonymous: false,
  };
  const alex = {
    key: 'user-2',
    userId: 'user-2',
    displayName: 'Alex',
    anonymous: false,
  };

  it('hides when the current user is the only claimant', () => {
    expect(
      shouldShowClaimBadgeEntries(
        [jamie],
        'user-1',
        true,
        [{ UserId: 'user-1' }]
      )
    ).toBe(false);
  });

  it('shows when others also claimed', () => {
    expect(
      shouldShowClaimBadgeEntries(
        [jamie, alex],
        'user-1',
        true,
        [{ UserId: 'user-1' }, { UserId: 'user-2' }]
      )
    ).toBe(true);
  });

  it('shows for other viewers', () => {
    expect(
      shouldShowClaimBadgeEntries([jamie], 'user-2', false, [{ UserId: 'user-1' }])
    ).toBe(true);
  });

  it('hides sole anonymous claim by the current user', () => {
    expect(
      shouldShowClaimBadgeEntries(
        [{ key: 'anonymous', userId: null, displayName: 'Anonymous', anonymous: true }],
        'user-1',
        true,
        [{ UserId: 'user-1' }]
      )
    ).toBe(false);
  });
});
