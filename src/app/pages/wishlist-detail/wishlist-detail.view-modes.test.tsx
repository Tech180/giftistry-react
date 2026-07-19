import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ITEM_VIEW_MODES, ITEM_VIEW_MODE_LABELS } from 'features/items/constants/item-view-mode.constants';
import { normalizeStoredViewMode } from 'features/items/utils/item-view-mode.util';
import { ItemCardRouter } from 'features/items/components/views/item-card-router.component';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: { Id: 'user-1', FirstName: 'Test', LastName: 'User', Username: 'testuser' },
    canShowAi: false,
  }),
}));

vi.mock('features/items/hooks/use-item-ai-reviews', () => ({
  useItemAiReviews: () => ({
    reviews: null,
    reviewsLoading: false,
    reviewsError: null,
  }),
}));

const baseItem = {
  Id: 'item-1',
  Name: 'Test Gift',
  Description: 'A nice gift',
  Category: 'electronics',
  PriorityId: null,
  Priority: null,
  IsClaimed: false,
  IsSuggestion: false,
  Links: [{ Id: 'link-1', Url: 'https://example.com', RetailerName: 'Example', ExtractedPrice: 49.99 }],
  Claims: [],
  SharedWith: [],
};

const baseProps = {
  item: baseItem as any,
  isOwner: false,
  isExpired: false,
  canCollaborate: false,
  allowGroupFunds: false,
  isFullyClaimed: false,
  totalExtractedPrice: 49.99,
  totalClaimedAmount: 0,
  urlInput: '',
  setUrlInput: vi.fn(),
  showAddLink: false,
  setShowAddLink: vi.fn(),
  linkLoading: false,
  handleAddLink: vi.fn(),
  showClaimForm: false,
  setShowClaimForm: vi.fn(),
  claimAmount: '',
  setClaimAmount: vi.fn(),
  claimedByName: '',
  setClaimedByName: vi.fn(),
  anonymous: false,
  setAnonymous: vi.fn(),
  claimLoading: false,
  handleClaim: vi.fn(),
  showDeleteConfirm: false,
  setShowDeleteConfirm: vi.fn(),
  deleteLoading: false,
  handleDelete: vi.fn(),
  isFavorite: false,
  toggleFavorite: vi.fn(),
  claimedByCurrentUser: false,
  handleUnclaim: vi.fn(),
  isPinned: false,
  togglePin: vi.fn(),
  displayDescription: 'A nice gift',
  metadata: null,
  predefinedDisplayEntries: [],
  userDefinedEntries: [],
  metadataBadgeEmoji: {},
  CategoryIcon: () => null,
  displayCategoryBadge: true,
  categoryLabel: 'Electronics',
  getSiteName: () => 'Example',
  audienceLabel: null,
  isPrivate: false,
  linkedItems: [],
  isLinkingContext: false,
  aiEnabled: false,
  canShowAi: false,
};

describe('item-view-mode domain', () => {
  it('migrates legacy full storage value to detailed', () => {
    expect(normalizeStoredViewMode('full')).toBe('detailed');
  });

  it('exposes five view mode labels', () => {
    expect(ITEM_VIEW_MODES).toHaveLength(5);
    expect(ITEM_VIEW_MODE_LABELS.detailed).toBe('Detailed');
    expect(ITEM_VIEW_MODE_LABELS.kanban).toBe('Kanban');
    expect(ITEM_VIEW_MODE_LABELS.feed).toBe('Feed');
  });
});

describe('ItemCardRouter', () => {
  it('renders item name in detailed view', () => {
    render(<ItemCardRouter {...baseProps} viewMode="detailed" />);
    expect(screen.getByText('Test Gift')).toBeInTheDocument();
  });

  it('renders item name in kanban view', () => {
    render(<ItemCardRouter {...baseProps} viewMode="kanban" />);
    expect(screen.getByText('Test Gift')).toBeInTheDocument();
  });

  it('shows claim button for non-owner in feed view', () => {
    render(<ItemCardRouter {...baseProps} viewMode="feed" />);
    expect(screen.getByRole('button', { name: /claim item/i })).toBeInTheDocument();
  });

  it('shows tagging select circle when tagging mode is active', () => {
    render(
      <ItemCardRouter
        {...baseProps}
        viewMode="detailed"
        isTaggingModeActive
        onSelectTag={vi.fn()}
      />
    );
    expect(screen.getByLabelText('Select item')).toBeInTheDocument();
  });

  it('calls onSelect in grid view when clicked', () => {
    const onSelect = vi.fn();
    const { container } = render(<ItemCardRouter {...baseProps} viewMode="grid" onSelect={onSelect} />);
    fireEvent.click(container.querySelector('[class*="gift-card"]') as Element);
    expect(onSelect).toHaveBeenCalled();
  });
});
