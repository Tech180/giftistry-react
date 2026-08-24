import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ItemCard } from './item-card.component';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: { Id: 'viewer-1', FirstName: 'Pat', LastName: 'Viewer', Username: 'pat' },
    canShowAi: false,
  }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'default', tryTheme: vi.fn() }),
}));

vi.mock('features/comments', () => ({
  Tags: ({
    taggedIds,
    onItemTaggedClick,
  }: {
    taggedIds: string[];
    onItemTaggedClick?: (id: string) => void;
  }) => (
    <div data-testid="linked-tags">
      {taggedIds.map((id) => (
        <button key={id} type="button" onClick={() => onItemTaggedClick?.(id)}>
          tag-{id}
        </button>
      ))}
    </div>
  ),
}));

const itemActions = {
  updateItem: vi.fn(),
  addItemLink: vi.fn(),
  claimItem: vi.fn(),
  unclaimItem: vi.fn(),
  deleteItem: vi.fn(),
};

const suggestionItem = {
  Id: 'item-1',
  Name: 'Suggested Gift',
  Description: 'Nice',
  Category: 'electronics',
  PriorityId: null,
  Priority: null,
  IsClaimed: false,
  IsSuggestion: true,
  SuggestedByUserId: 'viewer-1',
  SuggestedByUsername: 'pat',
  Links: [],
  Claims: [],
  SharedWith: [],
};

describe('ItemCard suggestor view vs edit', () => {
  test('suggestor viewer sees edit without view', () => {
    render(
      <ItemCard
        item={suggestionItem as never}
        isOwner={false}
        isExpired={false}
        canCollaborate={false}
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="compact"
        onEdit={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /edit item/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /view item/i })).not.toBeInTheDocument();
  });

  test('non-suggestor viewer keeps view without edit', () => {
    render(
      <ItemCard
        item={
          {
            ...suggestionItem,
            SuggestedByUserId: 'someone-else',
            SuggestedByUsername: 'other',
          } as never
        }
        isOwner={false}
        isExpired={false}
        canCollaborate={false}
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="compact"
        onEdit={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /view item/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit item/i })).not.toBeInTheDocument();
  });

  test('owner on locked list sees view when edit is unavailable', () => {
    render(
      <ItemCard
        item={
          {
            ...suggestionItem,
            IsSuggestion: false,
            SuggestedByUserId: null,
          } as never
        }
        isOwner
        isExpired={false}
        isArchived
        canCollaborate={false}
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="compact"
        onView={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /view item/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit item/i })).not.toBeInTheDocument();
  });

  test('owner with edit keeps edit and hides view', () => {
    render(
      <ItemCard
        item={
          {
            ...suggestionItem,
            IsSuggestion: false,
            SuggestedByUserId: null,
          } as never
        }
        isOwner
        isExpired={false}
        canCollaborate
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="compact"
        onEdit={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /edit item/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /view item/i })).not.toBeInTheDocument();
  });

  test('grid click opens edit for the suggestion creator', () => {
    const onEdit = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <ItemCard
        item={suggestionItem as never}
        isOwner={false}
        isExpired={false}
        canCollaborate={false}
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="grid"
        onEdit={onEdit}
        onSelect={onSelect}
        onView={vi.fn()}
      />
    );

    fireEvent.click(container.querySelector('[class*="gift-card"]') as Element);
    expect(onEdit).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('grid click opens view select for a non-creator', () => {
    const onEdit = vi.fn();
    const onSelect = vi.fn();
    const { container } = render(
      <ItemCard
        item={
          {
            ...suggestionItem,
            SuggestedByUserId: 'someone-else',
            SuggestedByUsername: 'other',
          } as never
        }
        isOwner={false}
        isExpired={false}
        canCollaborate={false}
        allowGroupFunds={false}
        itemActions={itemActions as never}
        viewMode="grid"
        onEdit={onEdit}
        onSelect={onSelect}
        onView={vi.fn()}
      />
    );

    fireEvent.click(container.querySelector('[class*="gift-card"]') as Element);
    expect(onSelect).toHaveBeenCalled();
    expect(onEdit).not.toHaveBeenCalled();
  });

  test('claiming a linked item shows Claim these items? and claims all on confirm', async () => {
    const claimItem = vi.fn().mockResolvedValue({});
    const peer = {
      ...suggestionItem,
      Id: 'item-2',
      Name: 'Linked Peer',
      IsSuggestion: false,
      SuggestedByUserId: null,
      IsClaimed: false,
    };
    const linkedSource = {
      ...suggestionItem,
      IsSuggestion: false,
      SuggestedByUserId: null,
      Metadata: { LinkedItemIds: ['item-2'] },
    };

    render(
      <ItemCard
        item={linkedSource as never}
        isOwner={false}
        isExpired={false}
        canCollaborate
        allowGroupFunds={false}
        itemActions={{ ...itemActions, claimItem, claimItems: vi.fn() } as never}
        viewMode="detailed"
        wishlistItems={[linkedSource, peer] as never}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /claim item/i }));
    expect(await screen.findByText('Claim these items?')).toBeInTheDocument();
    expect(screen.queryByText('Claim this item?')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /claim all/i }));

    await waitFor(() => {
      expect(claimItem).toHaveBeenCalledWith(
        expect.objectContaining({
          itemId: 'item-1',
          includeLinked: true,
        })
      );
    });
  });

  test('multi-count linked group calls onLinkedItemsUnsupported instead of opening claim form', async () => {
    const onLinkedItemsUnsupported = vi.fn();
    const claimItem = vi.fn();
    const peer = {
      ...suggestionItem,
      Id: 'item-2',
      IsSuggestion: false,
      IsClaimed: false,
    };
    const linkedSource = {
      ...suggestionItem,
      IsSuggestion: false,
      DesiredQuantity: 3,
      IsMultiCount: true,
      Metadata: { LinkedItemIds: ['item-2'] },
    };

    render(
      <ItemCard
        item={linkedSource as never}
        isOwner={false}
        isExpired={false}
        canCollaborate
        allowGroupFunds={false}
        itemActions={{ ...itemActions, claimItem, claimItems: vi.fn() } as never}
        viewMode="detailed"
        wishlistItems={[linkedSource, peer] as never}
        onLinkedItemsUnsupported={onLinkedItemsUnsupported}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /claim item/i }));

    await waitFor(() => {
      expect(onLinkedItemsUnsupported).toHaveBeenCalled();
    });
    expect(screen.queryByText('Claim these items?')).not.toBeInTheDocument();
    expect(screen.queryByText('Claim this item?')).not.toBeInTheDocument();
    expect(claimItem).not.toHaveBeenCalled();
  });

  test('unclaiming a linked group calls unclaimItem with includeLinked true', async () => {
    const unclaimItem = vi.fn().mockResolvedValue(undefined);
    const peer = {
      ...suggestionItem,
      Id: 'item-2',
      Name: 'Linked Peer',
      IsSuggestion: false,
      SuggestedByUserId: null,
      IsClaimed: true,
      Claims: [
        {
          Id: 'c2',
          ItemId: 'item-2',
          UserId: 'viewer-1',
          Amount: null,
          ClaimedByName: 'Pat',
        },
      ],
    };
    const linkedSource = {
      ...suggestionItem,
      IsSuggestion: false,
      SuggestedByUserId: null,
      IsClaimed: true,
      Metadata: { LinkedItemIds: ['item-2'] },
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'viewer-1',
          Amount: null,
          ClaimedByName: 'Pat',
        },
      ],
    };

    render(
      <ItemCard
        item={linkedSource as never}
        isOwner={false}
        isExpired={false}
        canCollaborate
        allowGroupFunds={false}
        itemActions={{ ...itemActions, unclaimItem, claimItems: vi.fn() } as never}
        viewMode="detailed"
        wishlistItems={[linkedSource, peer] as never}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /unclaim all/i }));

    await waitFor(() => {
      expect(unclaimItem).toHaveBeenCalledWith('item-1', 'viewer-1', true);
    });
  });
});
