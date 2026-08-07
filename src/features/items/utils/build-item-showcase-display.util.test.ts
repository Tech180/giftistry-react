import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import {
  buildShowcaseRelationItems,
  buildShowcaseVariationProgress,
  formatShowcaseBestPrice,
  formatShowcaseDisplayCategory,
  formatShowcaseQuantityProgressMetric,
  formatShowcaseStatusLabel,
  formatShowcaseSuggestionLabel,
  resolveShowcaseHasNumericPriority,
  resolveShowcaseVariationOptions,
} from './build-item-showcase-display.util';

const baseItem: Item = {
  Id: 'i1',
  ListId: 'l1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Socks',
  Description: null,
  IsHiddenIdea: false,
  Category: 'Apparel',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

describe('build-item-showcase-display.util', () => {
  it('formats status labels', () => {
    expect(formatShowcaseStatusLabel(true, false)).toBe('Claimed');
    expect(formatShowcaseStatusLabel(false, true)).toBe('Claimed by you');
    expect(formatShowcaseStatusLabel(false, false)).toBe('Available');
  });

  it('formats best price and category display', () => {
    expect(formatShowcaseBestPrice(0)).toBe('—');
    expect(formatShowcaseBestPrice(12.5)).toBe('$12.50');
    expect(formatShowcaseDisplayCategory(undefined, baseItem)).toBe('Apparel');
    expect(formatShowcaseDisplayCategory('Kitchen', baseItem)).toBe('Kitchen');
  });

  it('detects numeric priority', () => {
    expect(resolveShowcaseHasNumericPriority(null)).toBe(false);
    expect(resolveShowcaseHasNumericPriority(1)).toBe(true);
  });

  it('builds variation progress and options', () => {
    const item = {
      ...baseItem,
      Claims: [
        {
          Id: 'c1',
          ItemId: 'i1',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: null,
          Selection: 'Medium',
          Quantity: 1,
        },
      ],
    };
    const meta = {
      Variations: [
        { Name: 'Medium', Quantity: 2 },
        { Name: 'Large', Quantity: 1 },
      ],
    };
    const progress = buildShowcaseVariationProgress(item, meta);
    expect(progress[0]).toMatchObject({
      name: 'Medium',
      claimed: 1,
      total: 2,
      percent: 50,
      qtyLabel: '1 / 2 claimed',
    });
    const options = resolveShowcaseVariationOptions(item, meta);
    expect(options[0].optionLabel).toBe('Medium (1 remaining)');
    expect(options[1].disabled).toBe(false);
  });

  it('builds relation rows and suggestion labels', () => {
    expect(
      buildShowcaseRelationItems([
        { ...baseItem, Id: 'a', IsClaimed: true },
        { ...baseItem, Id: 'b', IsClaimed: false },
      ])
    ).toEqual([
      { id: 'a', name: 'Socks', statusLabel: 'Claimed' },
      { id: 'b', name: 'Socks', statusLabel: 'Available' },
    ]);
    expect(formatShowcaseSuggestionLabel(null)).toBe('Suggestion by Collaborator');
    expect(formatShowcaseQuantityProgressMetric(40, 2, 5)).toBe('40% (2 / 5)');
  });
});
