import { resolveCurrentUserClaimIsAnonymous } from './resolve-current-user-claim-is-anonymous.util';

describe('resolveCurrentUserClaimIsAnonymous', () => {
  it('returns false when there is no current user id', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [{ UserId: 'user-1', Anonymous: true, ClaimedByName: 'Anonymous' }],
        null
      )
    ).toBe(false);
  });

  it('returns true when the user has an Anonymous flag claim', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [
          {
            UserId: 'user-1',
            Anonymous: true,
            ClaimedByName: 'Anonymous',
          },
        ],
        'user-1'
      )
    ).toBe(true);
  });

  it('returns true when ClaimedByName is Anonymous without the flag', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [
          {
            UserId: 'user-1',
            Anonymous: false,
            ClaimedByName: 'Anonymous',
          },
        ],
        'user-1'
      )
    ).toBe(true);
  });

  it('returns false for the user’s named claim', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [
          {
            UserId: 'user-1',
            Anonymous: false,
            ClaimedByName: 'Jamie Lee',
          },
        ],
        'user-1'
      )
    ).toBe(false);
  });

  it('ignores other users anonymous claims', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [
          {
            UserId: 'user-2',
            Anonymous: true,
            ClaimedByName: 'Anonymous',
          },
        ],
        'user-1'
      )
    ).toBe(false);
  });

  it('returns true when the user has mixed anonymous and named claims', () => {
    expect(
      resolveCurrentUserClaimIsAnonymous(
        [
          {
            UserId: 'user-1',
            Anonymous: false,
            ClaimedByName: 'Jamie Lee',
          },
          {
            UserId: 'user-1',
            Anonymous: true,
            ClaimedByName: 'Anonymous',
          },
        ],
        'user-1'
      )
    ).toBe(true);
  });
});
