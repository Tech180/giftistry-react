import {
  getItemsContainerClass,
  getLayoutClass,
  getSelectableViewModes,
  isKanbanViewMode,
  normalizeStoredViewMode,
  resolveEffectiveViewMode,
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

  describe('isKanbanViewMode', () => {
    it('returns true only for kanban', () => {
      expect(isKanbanViewMode('kanban')).toBe(true);
      expect(isKanbanViewMode('detailed')).toBe(false);
    });
  });

  describe('resolveEffectiveViewMode', () => {
    it('keeps kanban when ultra-wide supports it', () => {
      expect(resolveEffectiveViewMode('kanban', true)).toBe('kanban');
    });

    it('falls back to detailed when kanban is not supported', () => {
      expect(resolveEffectiveViewMode('kanban', false)).toBe('detailed');
    });

    it('leaves other modes unchanged regardless of support', () => {
      expect(resolveEffectiveViewMode('compact', false)).toBe('compact');
      expect(resolveEffectiveViewMode('grid', true)).toBe('grid');
    });
  });

  describe('getSelectableViewModes', () => {
    it('includes kanban when supported', () => {
      expect(getSelectableViewModes(true)).toEqual([
        'detailed',
        'compact',
        'grid',
        'kanban',
        'feed',
      ]);
    });

    it('omits kanban when not supported', () => {
      expect(getSelectableViewModes(false)).toEqual([
        'detailed',
        'compact',
        'grid',
        'feed',
      ]);
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
