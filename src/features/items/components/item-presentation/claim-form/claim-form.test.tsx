import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import type { Item } from '../../../interfaces/item.interface';
import type { ItemActions } from '../../../interfaces/item-actions.interface';
import { ClaimForm } from './claim-form.component';

const baseItem: Item = {
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Socks',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

function mockActions(overrides: Partial<ItemActions> = {}): ItemActions {
  return {
    updateItem: vi.fn(),
    addItemLink: vi.fn(),
    claimItem: vi.fn().mockResolvedValue({}),
    claimItems: vi.fn().mockResolvedValue([]),
    unclaimItem: vi.fn().mockResolvedValue(undefined),
    deleteItem: vi.fn(),
    ...overrides,
  };
}

describe('ClaimForm', () => {
  it('prefills 1 for a new multi-count claim and confirms via NumberSelector', async () => {
    const itemActions = mockActions();
    render(
      <ClaimForm
        item={{ ...baseItem, DesiredQuantity: 5, IsMultiCount: true }}
        userId="u1"
        claimedByName="Ada"
        itemActions={itemActions}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Select quantities')).toBeInTheDocument();
    expect(screen.queryByText('Quantity to claim')).not.toBeInTheDocument();
    expect(screen.queryByText('Generic')).not.toBeInTheDocument();
    expect(screen.getByTitle('Amount left')).toHaveTextContent('5');
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Claim' }));
    await waitFor(() => {
      expect(itemActions.claimItems).toHaveBeenCalledWith([
        expect.objectContaining({
          itemId: 'item-1',
          quantity: 1,
          selection: null,
        }),
      ]);
    });
  });

  it('shows variation rows, remaining badges, and clamps via increment', () => {
    render(
      <ClaimForm
        item={{ ...baseItem, IsMultiCount: true }}
        metadata={{
          Variations: [
            { Name: 'Red', Quantity: 2 },
            { Name: 'Blue', Quantity: 1 },
          ],
        }}
        userId="u1"
        claimedByName="Ada"
        itemActions={mockActions()}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByTitle('Amount left')).toHaveTextContent('3');
    expect(screen.queryByRole('button', { name: 'Unclaim all' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Unclaim All' })).not.toBeInTheDocument();

    const increaseRed = screen.getByRole('button', { name: 'Increase Red' });
    fireEvent.click(increaseRed);
    expect(increaseRed).toBeDisabled();
    expect(screen.getByLabelText('0 remaining')).toBeInTheDocument();
  });

  it('shows leftover unassigned quantity as Generic', () => {
    render(
      <ClaimForm
        item={{ ...baseItem, DesiredQuantity: 4, IsMultiCount: true }}
        metadata={{
          Variations: [{ Name: 'Red', Quantity: 2 }],
        }}
        userId="u1"
        claimedByName="Ada"
        itemActions={mockActions()}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Generic')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase Generic' })).toBeInTheDocument();
  });

  it('hides variations fully claimed by someone else and still shows them to the claimer', () => {
    const item = {
      ...baseItem,
      DesiredQuantity: 3,
      IsMultiCount: true,
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'u2',
          Amount: null,
          ClaimedByName: 'Bea',
          Quantity: 1,
          Selection: 'Red',
        },
      ],
    };
    const metadata = {
      Variations: [
        { Name: 'Red', Quantity: 1 },
        { Name: 'Blue', Quantity: 1 },
        { Name: 'Green', Quantity: 1 },
      ],
    };

    const { rerender } = render(
      <ClaimForm
        item={item}
        metadata={metadata}
        userId="u1"
        claimedByName="Ada"
        itemActions={mockActions()}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByTitle('Amount left')).toHaveTextContent('2');
    expect(screen.queryByText('Red')).not.toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();

    rerender(
      <ClaimForm
        item={item}
        metadata={metadata}
        userId="u2"
        claimedByName="Bea"
        itemActions={mockActions()}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByTitle('Amount left')).toHaveTextContent('2');
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('disables no-op confirm and does not unclaim from inside the form', () => {
    render(
      <ClaimForm
        item={{
          ...baseItem,
          DesiredQuantity: 5,
          IsMultiCount: true,
          Claims: [
            {
              Id: 'c1',
              ItemId: 'item-1',
              UserId: 'u1',
              Amount: null,
              ClaimedByName: 'Ada',
              Quantity: 2,
            },
          ],
        }}
        userId="u1"
        claimedByName="Ada"
        itemActions={mockActions()}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    expect(screen.getByText('Update your quantities')).toBeInTheDocument();
    expect(screen.getByTitle('Amount left')).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: 'Update Claim' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Unclaim all' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Unclaim All' })).not.toBeInTheDocument();
  });

  it('enables confirm after changing a quantity with the NumberSelector', async () => {
    const itemActions = mockActions();
    render(
      <ClaimForm
        item={{
          ...baseItem,
          DesiredQuantity: 5,
          IsMultiCount: true,
          Claims: [
            {
              Id: 'c1',
              ItemId: 'item-1',
              UserId: 'u1',
              Amount: null,
              ClaimedByName: 'Ada',
              Quantity: 2,
            },
          ],
        }}
        userId="u1"
        claimedByName="Ada"
        itemActions={itemActions}
        anonymous={false}
        onAnonymousChange={() => {}}
        onSubmitted={() => {}}
        onCancel={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    const confirm = screen.getByRole('button', { name: 'Update Claim' });
    expect(confirm).not.toBeDisabled();
    fireEvent.click(confirm);
    await waitFor(() => {
      expect(itemActions.unclaimItem).toHaveBeenCalled();
    });
  });
});
