import { describe, expect, test, vi } from 'vitest';
import { CORE_LIBRARY_LABEL } from '../../metadata-packs/constants/core-library-label.constant';
import type { DirectoryPackRow } from '../../metadata-packs/interfaces/directory-pack-row.interface';
import { applyPromptValue } from './apply-prompt-value.util';
import { directoryPackCategoryLabel } from './directory-pack-category-label.util';
import { isDirectoryWorkspaceView } from './is-directory-workspace-view.util';
import { isTechnologyPack } from './is-technology-pack.util';
import { promptResetLabel } from './prompt-reset-label.util';
import { promptValueForType } from './prompt-value-for-type.util';
import { toDirectoryPackListItem } from './to-directory-pack-list-item.util';
import { toPromptValuesFromDefaults } from './to-prompt-values-from-defaults.util';
import { toWorkspacePromptNavItem } from './to-workspace-prompt-nav-item.util';

const cpuPack: DirectoryPackRow = {
  Id: 'technology.cpu',
  Label: 'CPU',
  Description: 'CPU',
  Fields: [],
  PromptFragment: '',
  Match: { Categories: [] },
  ParentLabel: 'Technology',
  IsRoot: false,
  IsCustom: false,
};

const technologyPack: DirectoryPackRow = {
  Id: 'technology',
  Label: 'Technology',
  Description: 'Tech',
  Fields: [],
  PromptFragment: '',
  Match: { Categories: [] },
  ParentLabel: null,
  IsRoot: true,
  IsCustom: false,
};

describe('promptValueForType', () => {
  const values = {
    review: 'r',
    description: 'd',
    populate: 'p',
    category: 'c',
    import: 'i',
  };

  test('returns the matching prompt body', () => {
    expect(promptValueForType('populate', values)).toBe('p');
    expect(promptValueForType('import', values)).toBe('i');
  });
});

describe('promptResetLabel', () => {
  test('uses a populate-specific label', () => {
    expect(promptResetLabel('populate')).toBe('Reset populate prompt to default');
    expect(promptResetLabel('review')).toBe('Reset to default');
  });
});

describe('isTechnologyPack', () => {
  test('matches the technology family', () => {
    expect(isTechnologyPack('technology')).toBe(true);
    expect(isTechnologyPack('technology.cpu')).toBe(true);
    expect(isTechnologyPack('media')).toBe(false);
  });
});

describe('directoryPackCategoryLabel', () => {
  test('uses Core Library for roots and the parent label for children', () => {
    expect(directoryPackCategoryLabel(technologyPack)).toBe(CORE_LIBRARY_LABEL);
    expect(directoryPackCategoryLabel(cpuPack)).toBe('Technology');
  });

  test('uses Custom for owner-authored packs', () => {
    expect(
      directoryPackCategoryLabel({
        ...cpuPack,
        Id: 'custom.books',
        Label: 'Books',
        IsCustom: true,
        IsRoot: true,
        ParentLabel: null,
      })
    ).toBe('Custom');
  });
});

describe('isDirectoryWorkspaceView', () => {
  test('is true for directory and pack detail', () => {
    expect(isDirectoryWorkspaceView({ kind: 'directory' })).toBe(true);
    expect(isDirectoryWorkspaceView({ kind: 'pack-detail', packId: 'technology.cpu' })).toBe(true);
    expect(isDirectoryWorkspaceView({ kind: 'pack-create' })).toBe(true);
    expect(isDirectoryWorkspaceView({ kind: 'pack-edit', packId: 'custom.books' })).toBe(true);
    expect(isDirectoryWorkspaceView({ kind: 'prompt', promptType: 'populate' })).toBe(false);
  });
});

describe('toDirectoryPackListItem', () => {
  test('adds enabled, category, and technology flags', () => {
    const item = toDirectoryPackListItem(cpuPack, new Set(['technology.cpu']));
    expect(item.enabled).toBe(true);
    expect(item.categoryLabel).toBe('Technology');
    expect(item.isTechnology).toBe(true);
  });
});

describe('toWorkspacePromptNavItem', () => {
  test('marks the active prompt', () => {
    const item = toWorkspacePromptNavItem(
      {
        id: 'populate',
        label: 'Populate',
        description: '',
        tokens: [],
        icon: 'terminal',
      },
      { kind: 'prompt', promptType: 'populate' }
    );
    expect(item.active).toBe(true);
  });
});

describe('applyPromptValue', () => {
  test('calls the matching setter', () => {
    const setters = {
      review: vi.fn(),
      description: vi.fn(),
      populate: vi.fn(),
      category: vi.fn(),
      import: vi.fn(),
    };
    applyPromptValue('category', 'next', setters);
    expect(setters.category).toHaveBeenCalledWith('next');
    expect(setters.populate).not.toHaveBeenCalled();
  });
});

describe('toPromptValuesFromDefaults', () => {
  test('maps backend default prompt fields', () => {
    expect(
      toPromptValuesFromDefaults({
        Review: 'r',
        Description: 'd',
        Populate: 'p',
        Category: 'c',
        Import: 'i',
      })
    ).toEqual({
      review: 'r',
      description: 'd',
      populate: 'p',
      category: 'c',
      import: 'i',
    });
  });
});
