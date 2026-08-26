import { describe, expect, it } from 'vitest';
import { formatItemAsGiftistryMarkdown } from './format-item-as-giftistry-markdown.util';
import type { Item } from '../interfaces/item.interface';

/** Golden fixture shared with giftistry-bun giftistry-export-parse tests (single-item slice). */
const GOLDEN_COFFEE_MAKER_MD = [
  '# Coffee Maker',
  '',
  '- Category: Home',
  '- Priority: 1',
  '- Favorite: yes',
  '- Price: 49.99',
  '- Link: https://example.com/a',
  '- Retailer: Example',
  '',
  'Drip coffee',
  '',
].join('\n');

function coffeeMaker(): Item {
  return {
    Id: 'item-1',
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Name: 'Coffee Maker',
    Description: 'Drip coffee',
    IsHiddenIdea: false,
    Category: 'Home',
    CategoryLabel: 'Home',
    Priority: 1,
    Links: [
      {
        Id: 'link-1',
        ItemId: 'item-1',
        Url: 'https://example.com/a',
        RetailerName: 'Example',
        ExtractedPrice: 49.99,
        ExtractedImageUrl: null,
      },
    ],
    Claims: [],
    IsClaimed: false,
    Metadata: { Text: 'Drip coffee', IsFavorite: true },
  };
}

describe('formatItemAsGiftistryMarkdown', () => {
  it('matches the golden Giftistry Markdown dialect for a typical item', () => {
    expect(formatItemAsGiftistryMarkdown(coffeeMaker())).toBe(GOLDEN_COFFEE_MAKER_MD);
  });

  it('includes custom fields section when present', () => {
    const md = formatItemAsGiftistryMarkdown({
      ...coffeeMaker(),
      Metadata: {
        Text: 'Drip coffee',
        IsFavorite: true,
        CustomFields: {
          Predefined: { Color: 'Blue' },
          UserDefined: {},
        },
      },
    });
    expect(md).toContain('## Custom fields');
    expect(md).toContain('- Color: Blue');
  });
});
