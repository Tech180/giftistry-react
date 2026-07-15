import {
  getPrimaryClaimForBadge,
  getClaimedByDisplayName,
  getClaimedGrayOutClass,
  getUserClaimedHighlightClass,
  shouldShowClaimBadge,
} from './item-card-modifiers.util';

describe('item-card-modifiers.util', () => {
  describe('getPrimaryClaimForBadge', () => {
    it('returns the first claim with a user id', () => {
      expect(
        getPrimaryClaimForBadge([
          { UserId: null, ClaimedByName: 'Anonymous', Anonymous: true },
          { UserId: 'user-2', ClaimedByName: 'Alex Kim', Anonymous: false },
        ])
      ).toEqual({
        userId: 'user-2',
        displayName: 'Alex Kim',
        anonymous: false,
      });
    });

    it('returns anonymous display when claim is anonymous', () => {
      expect(
        getPrimaryClaimForBadge([
          { UserId: null, ClaimedByName: 'Anonymous', Anonymous: true },
        ])
      ).toEqual({
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      });
    });

    it('returns anonymous display for own anonymous claim even with user id', () => {
      expect(
        getPrimaryClaimForBadge([
          { UserId: 'user-1', ClaimedByName: 'Jamie Lee', Anonymous: true },
        ])
      ).toEqual({
        userId: null,
        displayName: 'Anonymous',
        anonymous: true,
      });
    });

    it('returns null when there are no claims', () => {
      expect(getPrimaryClaimForBadge([])).toBeNull();
    });

    it('falls back to Someone when claimed by name is missing', () => {
      expect(
        getPrimaryClaimForBadge([
          { UserId: 'user-3', ClaimedByName: null, Anonymous: false },
        ])
      ).toEqual({
        userId: 'user-3',
        displayName: 'Someone',
        anonymous: false,
      });
    });
  });

  describe('getClaimedByDisplayName', () => {
    it('returns the first non-anonymous claim name', () => {
      expect(
        getClaimedByDisplayName([
          { ClaimedByName: 'Anonymous', Anonymous: true },
          { ClaimedByName: 'Taylor Swift', Anonymous: false },
        ])
      ).toBe('Taylor Swift');
    });
  });

  describe('getClaimedGrayOutClass', () => {
    const sharedStyles = { 'claimed-gray-out': 'claimed-gray-out' };

    it('returns gray-out class when fully claimed', () => {
      expect(getClaimedGrayOutClass(true, false, false, sharedStyles)).toBe('claimed-gray-out');
    });

    it('returns gray-out class when a visible claim exists', () => {
      expect(getClaimedGrayOutClass(false, true, false, sharedStyles)).toBe('claimed-gray-out');
    });

    it('returns empty string when the current user claimed the item', () => {
      expect(getClaimedGrayOutClass(true, true, true, sharedStyles)).toBe('');
    });

    it('returns empty string when item is not claimed', () => {
      expect(getClaimedGrayOutClass(false, false, false, sharedStyles)).toBe('');
    });
  });

  describe('getUserClaimedHighlightClass', () => {
    const sharedStyles = { 'user-claimed-highlight': 'user-claimed-highlight' };

    it('returns highlight class for the current user claim', () => {
      expect(getUserClaimedHighlightClass(true, sharedStyles)).toBe('user-claimed-highlight');
    });

    it('returns empty string for other viewers', () => {
      expect(getUserClaimedHighlightClass(false, sharedStyles)).toBe('');
    });
  });

  describe('shouldShowClaimBadge', () => {
    it('hides the badge for the current user claim', () => {
      expect(
        shouldShowClaimBadge(
          { userId: 'user-1', displayName: 'Jamie', anonymous: false },
          true
        )
      ).toBe(false);
    });

    it('shows the badge for other users', () => {
      expect(
        shouldShowClaimBadge(
          { userId: 'user-1', displayName: 'Jamie', anonymous: false },
          false
        )
      ).toBe(true);
    });
  });
});
