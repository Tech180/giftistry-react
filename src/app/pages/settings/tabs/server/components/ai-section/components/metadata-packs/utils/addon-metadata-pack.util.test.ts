import { describe, expect, test } from 'vitest';
import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';
import {
  addMetadataPackId,
  directoryEmptyMessage,
  filterDirectoryPacks,
  findDirectoryPack,
  listDirectoryPacks,
  removeMetadataPackId,
} from './addon-metadata-pack.util';

const catalog: MetadataPackView[] = [
  {
    Id: 'technology',
    Label: 'Technology',
    Description: 'Tech',
    Fields: [{ Key: 'Brand', Label: 'Brand' }],
    PromptFragment: 'Technology rules.',
    Children: [
      {
        Id: 'technology.cpu',
        Label: 'CPU',
        Description: 'CPU',
        Fields: [{ Key: 'Cores', Label: 'Cores' }],
        PromptFragment: 'CPU rules.',
      },
      {
        Id: 'technology.computer-parts',
        Label: 'Computer parts',
        Description: 'Parts',
        Fields: [{ Key: 'FormFactor', Label: 'Form factor' }],
        PromptFragment: 'Parts rules.',
      },
    ],
  },
];

const packs = listDirectoryPacks(catalog);

describe('addMetadataPackId', () => {
  test('adding a child also adds its parent', () => {
    expect(addMetadataPackId(catalog, [], 'technology.cpu')).toEqual([
      'technology',
      'technology.cpu',
    ]);
  });
});

describe('removeMetadataPackId', () => {
  test('removing the last child also drops the parent', () => {
    expect(
      removeMetadataPackId(catalog, ['technology', 'technology.cpu'], 'technology.cpu')
    ).toEqual([]);
  });

  test('removing one child leaves a sibling and the parent', () => {
    expect(
      removeMetadataPackId(
        catalog,
        ['technology', 'technology.cpu', 'technology.computer-parts'],
        'technology.cpu'
      )
    ).toEqual(['technology', 'technology.computer-parts']);
  });
});

describe('listDirectoryPacks', () => {
  test('includes the parent and leaf packs', () => {
    expect(packs.map((row) => row.Id)).toEqual([
      'technology',
      'technology.cpu',
      'technology.computer-parts',
    ]);
    expect(packs[0].IsRoot).toBe(true);
    expect(packs[0].ParentLabel).toBeNull();
    expect(packs[1].IsRoot).toBe(false);
    expect(packs[1].ParentLabel).toBe('Technology');
    expect(packs[1].Fields[0].Label).toBe('Cores');
    expect(packs[1].PromptFragment).toBe('CPU rules.');
  });
});

describe('filterDirectoryPacks', () => {
  test('returns every pack when search is empty', () => {
    expect(filterDirectoryPacks(packs, '').map((row) => row.Id)).toEqual([
      'technology',
      'technology.cpu',
      'technology.computer-parts',
    ]);
  });

  test('filters by label or description', () => {
    expect(filterDirectoryPacks(packs, 'computer').map((row) => row.Id)).toEqual([
      'technology.computer-parts',
    ]);
  });
});

describe('findDirectoryPack', () => {
  test('returns the matching row', () => {
    expect(findDirectoryPack(packs, 'technology.cpu')?.Label).toBe('CPU');
  });
});

describe('directoryEmptyMessage', () => {
  test('mentions search when a query is present', () => {
    expect(directoryEmptyMessage('cpu')).toBe('No metadata packs match your search.');
    expect(directoryEmptyMessage('')).toBe('No metadata packs available.');
  });
});
