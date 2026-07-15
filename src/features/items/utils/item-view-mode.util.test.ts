import {
  getItemsContainerClass,
  getLayoutClass,
  normalizeStoredViewMode,
} from './item-view-mode.util';

describe('item-view-mode.util', () => {
  describe('normalizeStoredViewMode', () => {
    it('maps legacy full to detailed', () => {
      expect(normalizeStoredViewMode('full')).toBe('detailed');
    });

    it('returns valid modes unchanged', () => {
      expect(normalizeStoredViewMode('kanban')).toBe('kanban');
      expect(normalizeStoredViewMode('feed')).toBe('feed');
    });

    it('falls back to detailed for null or invalid values', () => {
      expect(normalizeStoredViewMode(null)).toBe('detailed');
      expect(normalizeStoredViewMode('invalid')).toBe('detailed');
    });
  });

  describe('getLayoutClass', () => {
    it('returns layout-prefixed class names', () => {
      expect(getLayoutClass('detailed')).toBe('layout-detailed');
      expect(getLayoutClass('kanban')).toBe('layout-kanban');
    });
  });

  describe('getItemsContainerClass', () => {
    it('returns container class per mode', () => {
      expect(getItemsContainerClass('grid')).toBe('items-container-grid');
      expect(getItemsContainerClass('feed')).toBe('items-container-feed');
    });
  });
});
