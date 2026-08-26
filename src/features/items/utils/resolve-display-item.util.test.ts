import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';
import { resolveDisplayItem } from './resolve-display-item.util';
import { parseItemDescription } from 'shared/utils/parse-item-description.util';
import { getMetadataDisplayEntries } from 'shared/utils/item-custom-fields.util';

const parent = (): Item => ({
  Id: 'parent-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Original gift',
  Description: 'Parent notes',
  IsHiddenIdea: false,
  Category: 'tech',
  Links: [],
  Claims: [],
  IsClaimed: false,
  Metadata: {
    Text: 'Parent notes',
    CustomFields: {
      Predefined: { Color: 'Blue' },
      UserDefined: { Note: 'Parent custom' },
    },
  },
});

const option = (): ItemSubstitutionOption => ({
  Id: 'sub-1',
  Kind: 'owner_approved',
  SortOrder: 0,
  CreatedByUserId: 'user-1',
  Item: {
    Id: 'child-1',
    Name: 'Alt gift',
    Description: 'Child notes',
    Category: 'home',
    CustomFields: {
      Predefined: { Size: 'L' },
      UserDefined: {},
    },
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
});

describe('resolveDisplayItem', () => {
  it('returns the parent for the original browse option', () => {
    const source = parent();
    const browse = resolveItemSubstitutionOptions(source, [option()]);
    expect(resolveDisplayItem(source, browse[0]!)).toBe(source);
  });

  it('does not inherit parent description or custom fields on a substitution', () => {
    const source = parent();
    const browse = resolveItemSubstitutionOptions(source, [option()]);
    const display = resolveDisplayItem(source, browse[1]!);

    expect(display.Name).toBe('Alt gift');
    expect(display.Description).toBe('Child notes');
    expect(display.Category).toBe('home');

    const { text, metadata } = parseItemDescription(display.Description, display.Metadata);
    expect(text).toBe('Child notes');
    expect(metadata?.CustomFields?.Predefined).toEqual({ Size: 'L' });
    expect(metadata?.CustomFields?.UserDefined).toEqual({});

    const labels = getMetadataDisplayEntries(metadata).map((entry) => entry.label);
    expect(labels).toContain('Size');
    expect(labels).not.toContain('Color');
    expect(labels).not.toContain('Note');
  });

  it('keeps substitution description blank when the child has none', () => {
    const source = parent();
    const emptyChild: ItemSubstitutionOption = {
      ...option(),
      Item: {
        ...option().Item,
        Description: null,
        CustomFields: null,
      },
    };
    const browse = resolveItemSubstitutionOptions(source, [emptyChild]);
    const display = resolveDisplayItem(source, browse[1]!);
    const { text, metadata } = parseItemDescription(display.Description, display.Metadata);

    expect(text).toBeNull();
    expect(getMetadataDisplayEntries(metadata)).toEqual([]);
  });
});
