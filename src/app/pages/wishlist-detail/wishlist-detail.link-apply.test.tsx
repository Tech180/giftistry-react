import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { WishlistDetailTemplate } from './wishlist-detail.html';
import type { WishlistDetailTemplateProps } from './interfaces/wishlist-detail-template-props.interface';

vi.mock('./components/drawer/add-item/add-item.component', () => ({
  AddItem: ({
    isOpen,
    isLinkingModeActive,
    collapseDrawerWhileLinking,
  }: {
    isOpen: boolean;
    isLinkingModeActive: boolean;
    collapseDrawerWhileLinking?: boolean;
  }) => (
    <div
      data-testid="add-item"
      data-session-open={String(isOpen)}
      data-linking={String(isLinkingModeActive)}
      data-collapse={String(!!collapseDrawerWhileLinking)}
    />
  ),
}));

vi.mock('./components/add-item-widget/add-item-widget.component', () => ({
  AddItemWidget: () => null,
}));

vi.mock('./components/drawer/comments/comments.component', () => ({
  Comments: () => null,
}));

vi.mock('./components/header/header.component', () => ({
  Header: () => <header>Header</header>,
}));

vi.mock('features/items', () => ({
  ItemCard: () => null,
  ItemCardSkeleton: () => null,
  ItemShowcase: () => null,
  ImportStrip: () => null,
}));

vi.mock('features/comments', () => ({
  CommentSection: () => null,
}));

vi.mock('features/wishlists', () => ({
  SharePanel: () => null,
}));

vi.mock('features/jobs', () => ({
  JobProgressBox: () => null,
}));

const wishlist = {
  Id: 'list-1',
  Title: 'Birthday',
  UserId: 'user-1',
  OwnerUsername: 'owner',
  OwnerFirstName: 'Owner',
  Role: 'owner',
  AiEnabled: false,
  ManualJobBackground: true,
  AllowGroupFunds: false,
  ExpiresAt: null,
} as WishlistDetailTemplateProps['wishlist'];

const baseProps: WishlistDetailTemplateProps = {
  isWishlistLoading: false,
  wishlistError: null,
  wishlist,
  items: [],
  priorities: [],
  isOwner: true,
  canCollaborate: true,
  isExpired: false,
  isArchived: false,
  isAddOpen: true,
  setIsAddOpen: vi.fn(),
  openAddDrawer: vi.fn(),
  isAutoAddOpen: false,
  openAutoAdd: vi.fn(),
  closeAutoAdd: vi.fn(),
  onAutoAddStarted: vi.fn(),
  enrichingItemIds: new Set(),
  editingItem: null,
  setEditingItem: vi.fn(),
  openItemEditor: vi.fn(),
  setEditingItemDraft: vi.fn(),
  linkedItemIds: ['item-a'],
  setLinkedItemIds: vi.fn(),
  relatedItemIds: [] as string[],
  setRelatedItemIds: vi.fn(),
  linkableItems: [],
  resolvedLinkedItems: [],
  resolvedRelatedItems: [],
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
  isRelatingModeActive: false,
  setIsRelatingModeActive: vi.fn(),
  doesAddSidebarOverlayList: false,
  handleLinkingAudienceChange: vi.fn(),
  isItemLinkCompatible: () => true,
  handleLinkItemToggle: vi.fn(),
  handleRelateItemToggle: vi.fn(),
  loadData: vi.fn(async () => undefined),
  reloadListContent: vi.fn(async () => undefined),
  onItemsChange: vi.fn(),
  itemActions: {} as WishlistDetailTemplateProps['itemActions'],
  confirmAction: null,
  setConfirmAction: vi.fn(),
  isDeactivating: false,
  isActivating: false,
  isDeleting: false,
  handleDeactivateConfirm: vi.fn(),
  handleActivateConfirm: vi.fn(),
  handleDeleteConfirm: vi.fn(),
  saveTitle: vi.fn(async () => undefined),
  saveDate: vi.fn(async () => undefined),
  toggleRevealSuggestions: vi.fn(),
  formatDate: () => '',
  isCommentsOpen: false,
  setIsCommentsOpen: vi.fn(),
  isShareOpen: false,
  setIsShareOpen: vi.fn(),
  isImportOpen: false,
  setIsImportOpen: vi.fn(),
  importStripRef: { current: null },
  viewMode: 'grid',
  handleSetViewMode: vi.fn(),
  searchQuery: '',
  setSearchQuery: vi.fn(),
  selectedItem: null,
  setSelectedItemId: vi.fn(),
  selectedItemId: null,
  selectedItemPriorityLabel: undefined,
  groupedItems: [],
  collapsedGroupKeys: new Set(),
  toggleGroupCollapsed: vi.fn(),
  displayItems: [],
  listShares: [],
  handleItemTaggedClick: vi.fn(),
  isTaggingModeActive: false,
  setIsTaggingModeActive: vi.fn(),
  taggedItemIds: [],
  setTaggedItemIds: vi.fn(),
  isReplyTaggingModeActive: false,
  setIsReplyTaggingModeActive: vi.fn(),
  replyTaggedItemIds: [],
  setReplyTaggedItemIds: vi.fn(),
  handleSelectTag: vi.fn(),
  handleSelectReplyTag: vi.fn(),
  isLoading: false,
  activeJob: null,
  isCancellingJob: false,
  onCancelJob: vi.fn(),
};

describe('WishlistDetailTemplate link apply bar', () => {
  test('shows a bottom Apply button while linking when sidebar stays open', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          isLinkingModeActive
          doesAddSidebarOverlayList={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('link-apply-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    expect(screen.getByTestId('add-item')).toHaveAttribute('data-collapse', 'false');
  });

  test('shows Apply and collapses overlay sidebar while linking', () => {
    const setIsLinkingModeActive = vi.fn();

    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          isLinkingModeActive
          doesAddSidebarOverlayList
          setIsLinkingModeActive={setIsLinkingModeActive}
          linkedItemIds={['item-a']}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('link-apply-bar')).toBeInTheDocument();
    expect(screen.getByTestId('add-item')).toHaveAttribute('data-collapse', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(setIsLinkingModeActive).toHaveBeenCalledWith(false);
  });

  test('hides Apply bar when linking mode is inactive', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate {...baseProps} isLinkingModeActive={false} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('link-apply-bar')).toBeNull();
  });

  test('keeps form session props open while linking so the drawer can hide without reset', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          isAddOpen
          isLinkingModeActive
          doesAddSidebarOverlayList
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('add-item')).toHaveAttribute('data-session-open', 'true');
  });
});
