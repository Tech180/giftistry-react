import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SubstitutionManager } from './manager.component';

describe('SubstitutionManager', () => {
  it('toggles allow substitutions and lists owner options', () => {
    const onAllow = vi.fn();
    render(
      <SubstitutionManager
        parentItemId="parent-1"
        options={[
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
        ]}
        allowSubstitutions
        onAllowSubstitutionsChange={onAllow}
        onOpenCreate={vi.fn()}
        onOpenEdit={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />
    );

    expect(screen.getByText('Approved alt')).toBeInTheDocument();
    expect(screen.queryByText('Owner approved')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Allow substitutions'));
    expect(onAllow).toHaveBeenCalled();
  });

  it('calls onOpenCreate from the add button instead of opening a dialog', () => {
    const onOpenCreate = vi.fn();
    render(
      <SubstitutionManager
        parentItemId="parent-1"
        options={[]}
        allowSubstitutions
        onAllowSubstitutionsChange={vi.fn()}
        onOpenCreate={onOpenCreate}
        onOpenEdit={vi.fn()}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Add approved substitution/i }));
    expect(onOpenCreate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { name: 'Add approved substitution' })).not.toBeInTheDocument();
  });

  it('calls onOpenEdit when editing an option', () => {
    const onOpenEdit = vi.fn();
    const option = {
      Id: 'sub-1',
      Kind: 'owner_approved' as const,
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
    };
    render(
      <SubstitutionManager
        parentItemId="parent-1"
        options={[option]}
        allowSubstitutions
        onAllowSubstitutionsChange={vi.fn()}
        onOpenCreate={vi.fn()}
        onOpenEdit={onOpenEdit}
        onDelete={vi.fn()}
        onReorder={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit substitution'));
    expect(onOpenEdit).toHaveBeenCalledWith(option);
  });
});
