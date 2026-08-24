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
  Comments: ({
    isOpen,
    collapseDrawerWhileTagging,
  }: {
    isOpen: boolean;
    collapseDrawerWhileTagging?: boolean;
  }) => (
    <div
      data-testid="comments"
      data-session-open={String(isOpen)}
      data-collapse={String(!!collapseDrawerWhileTagging)}
    />
  ),
}));

vi.mock('./components/header/header.component', () => ({
  Header: () => <header>Header</header>,
}));

vi.mock('features/items', () => ({
  ItemCard: () => null,
  ItemCardSkeleton: () => null,
  ItemShowcase: () => null,
  getCategoryMeta: () => ({ label: '', icon: () => null }),
  CompactCategoryList: () => null,
}));

vi.mock('features/items/components/import/import-strip/import-strip.component', () => ({
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

vi.mock('shared/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('shared/ui')>();
  return {
    ...actual,
    Modal: ({
      isOpen,
      title,
      children,
    }: {
      isOpen: boolean;
      title?: string;
      children: React.ReactNode;
    }) =>
      isOpen ? (
        <div data-testid="share-modal" aria-label={title}>
          {children}
        </div>
      ) : null,
  };
});

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
  canSuggest: true,
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
  viewingItem: null,
  setViewingItem: vi.fn(),
  openItemViewer: vi.fn(),
  shouldOpenItemViewer: false,
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
  isItemRelateCompatible: () => true,
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
  formatDate: () => '',
  isCommentsOpen: false,
  setIsCommentsOpen: vi.fn(),
  showDeletedComments: false,
  onToggleShowDeletedComments: vi.fn(),
  isShareOpen: false,
  setIsShareOpen: vi.fn(),
  isMobileFab: false,
  isImportOpen: false,
  setIsImportOpen: vi.fn(),
  importStripRef: { current: null },
  viewMode: 'grid',
  supportsKanbanViewMode: true,
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
  onLinkedItemsUnsupported: vi.fn(),
  isHighlightInteractionLocked: false,
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

  test('shows Apply and collapses comments overlay while tagging items', () => {
    const setIsTaggingModeActive = vi.fn();

    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          isAddOpen={false}
          viewMode="detailed"
          isCommentsOpen
          isTaggingModeActive
          doesAddSidebarOverlayList
          setIsTaggingModeActive={setIsTaggingModeActive}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('link-apply-bar')).toBeInTheDocument();
    expect(screen.getByTestId('comments')).toHaveAttribute('data-collapse', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(setIsTaggingModeActive).toHaveBeenCalledWith(false);
  });

  test('hides tagging Apply bar when comments do not overlay the list', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          isAddOpen={false}
          viewMode="detailed"
          isCommentsOpen
          isTaggingModeActive
          doesAddSidebarOverlayList={false}
        />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('link-apply-bar')).toBeNull();
    expect(screen.getByTestId('comments')).toHaveAttribute('data-collapse', 'false');
  });

  test('viewer sees add and auto-add while import stays collaborator-only', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          wishlist={{ ...wishlist, AiEnabled: true }}
          canShowAi
          isOwner={false}
          canCollaborate={false}
          canSuggest
          isAddOpen={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /add manually/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto add from link/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /import/i })).not.toBeInTheDocument();
  });

  test('viewer without AI does not see auto-add', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate
          {...baseProps}
          wishlist={{ ...wishlist, AiEnabled: false }}
          canShowAi
          isOwner={false}
          canCollaborate={false}
          canSuggest
          isAddOpen={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /add manually/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /auto add from link/i })).not.toBeInTheDocument();
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

  test('renders share modal on desktop when share is open', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate {...baseProps} isShareOpen isMobileFab={false} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('share-modal')).toBeInTheDocument();
  });

  test('does not render share modal on mobile FAB viewport', () => {
    render(
      <MemoryRouter>
        <WishlistDetailTemplate {...baseProps} isShareOpen isMobileFab />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('share-modal')).toBeNull();
  });
});
