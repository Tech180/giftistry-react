import {
  getClaimedByDisplayName,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from './item-card-modifiers.util';

describe('item-card-modifiers.util', () => {
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
    const sharedStyles = { 'view--claimed-gray': 'view--claimed-gray' };

    it('returns gray-out class when fully claimed', () => {
      expect(getClaimedGrayOutClass(true, false, false, sharedStyles)).toBe('view--claimed-gray');
    });

    it('returns gray-out class when a visible single-qty claim exists', () => {
      expect(getClaimedGrayOutClass(false, true, false, sharedStyles)).toBe('view--claimed-gray');
    });

    it('does not gray multi-count items with a partial visible claim', () => {
      expect(
        getClaimedGrayOutClass(false, true, false, sharedStyles, false, true)
      ).toBe('');
    });

    it('grays multi-count items when fully claimed', () => {
      expect(
        getClaimedGrayOutClass(true, true, false, sharedStyles, false, true)
      ).toBe('view--claimed-gray');
    });

    it('returns empty string when the current user claimed the item', () => {
      expect(getClaimedGrayOutClass(true, true, true, sharedStyles)).toBe('');
    });

    it('returns empty string when item is not claimed', () => {
      expect(getClaimedGrayOutClass(false, false, false, sharedStyles)).toBe('');
    });

    it('does not gray items solely because the list is archived', () => {
      expect(getClaimedGrayOutClass(false, false, false, sharedStyles, true)).toBe('');
    });

    it('still grays fully claimed items on an archived list', () => {
      expect(getClaimedGrayOutClass(true, false, false, sharedStyles, true)).toBe(
        'view--claimed-gray'
      );
    });

    it('does not gray partial GF in progress', () => {
      expect(
        getClaimedGrayOutClass(false, true, false, sharedStyles, false, false, true)
      ).toBe('');
    });

    it('still grays fully claimed GF even if in-progress flag is set', () => {
      expect(
        getClaimedGrayOutClass(true, true, false, sharedStyles, false, false, true)
      ).toBe('view--claimed-gray');
    });

    it('grays when fully claimed even without visible claim flag from chrome', () => {
      expect(getClaimedGrayOutClass(true, false, false, sharedStyles)).toBe(
        'view--claimed-gray'
      );
    });
  });

  describe('getGroupFundingInProgressClass', () => {
    const sharedStyles = { 'view--group-funding': 'view--group-funding' };

    it('returns class when GF is in progress', () => {
      expect(getGroupFundingInProgressClass(true, sharedStyles)).toBe(
        'view--group-funding'
      );
    });

    it('returns empty string otherwise', () => {
      expect(getGroupFundingInProgressClass(false, sharedStyles)).toBe('');
    });
  });

  describe('getUserClaimedHighlightClass', () => {
    const sharedStyles = { 'view--user-claimed-highlight': 'view--user-claimed-highlight' };

    it('returns highlight class for the current user claim', () => {
      expect(getUserClaimedHighlightClass(true, sharedStyles)).toBe('view--user-claimed-highlight');
    });

    it('returns empty string for other viewers', () => {
      expect(getUserClaimedHighlightClass(false, sharedStyles)).toBe('');
    });
  });
});
