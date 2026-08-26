import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Item } from '../../../../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../../../../interfaces/item-substitution.interface';
import { SubstitutionSwitcher } from './switcher.component';

const parent: Item = {
  Id: 'parent-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Original',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

const options: ItemSubstitutionOption[] = [
  {
    Id: 'sub-1',
    Kind: 'owner_approved',
    SortOrder: 0,
    CreatedByUserId: 'owner-1',
    Item: {
      Id: 'child-1',
      Name: 'Approved alt',
      Description: null,
      Links: [],
      Photos: [],
      Claims: [],
      IsClaimed: false,
    },
  },
];

const threeOptions: ItemSubstitutionOption[] = [
  {
    Id: 'sub-1',
    Kind: 'owner_approved',
    SortOrder: 0,
    CreatedByUserId: 'owner-1',
    Item: {
      Id: 'child-1',
      Name: 'Approved alt 1',
      Description: null,
      Links: [],
      Photos: [],
      Claims: [],
      IsClaimed: false,
    },
  },
  {
    Id: 'sub-2',
    Kind: 'owner_approved',
    SortOrder: 1,
    CreatedByUserId: 'owner-1',
    Item: {
      Id: 'child-2',
      Name: 'Approved alt 2',
      Description: null,
      Links: [],
      Photos: [],
      Claims: [],
      IsClaimed: false,
    },
  },
];

describe('SubstitutionSwitcher', () => {
  it('shows next-only on the first option', () => {
    const onChange = vi.fn();
    render(
      <SubstitutionSwitcher
        parent={parent}
        options={options}
        activeIndex={0}
        onActiveIndexChange={onChange}
      >
        {(active) => <div>{active.label}</div>}
      </SubstitutionSwitcher>
    );

    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Previous option' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next option' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next option' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('shows previous-only on the last option and owner approved content', () => {
    render(
      <SubstitutionSwitcher parent={parent} options={options} activeIndex={1}>
        {(active) => <div>{active.label}</div>}
      </SubstitutionSwitcher>
    );

    expect(screen.getByRole('button', { name: 'Previous option' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next option' })).not.toBeInTheDocument();
    expect(screen.getByText('Approved alt')).toBeInTheDocument();
  });

  it('shows both previous and next buttons on a middle option', () => {
    render(
      <SubstitutionSwitcher parent={parent} options={threeOptions} activeIndex={1}>
        {(active) => <div>{active.label}</div>}
      </SubstitutionSwitcher>
    );

    expect(screen.getByRole('button', { name: 'Previous option' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next option' })).toBeInTheDocument();
    expect(screen.getByText('Approved alt 1')).toBeInTheDocument();
  });
});
