import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { PageTemplate } from './page.html';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';

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

vi.mock('./components/add-widget/add-widget.component', () => ({
  AddWidget: () => null,
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
  ImportStrip: React.forwardRef(() => null),
  getCategoryMeta: () => ({ label: '', icon: () => null }),
  CompactCategoryList: () => null,
}));

vi.mock('features/items/components/import/strip/strip.component', () => ({
  Strip: () => null,
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
} as PageTemplateProps['wishlist'];

const baseProps: PageTemplateProps = {
  isWishlistLoading: false,
  wishlistError: null,
  onGoHome: vi.fn(),
  canAutoAdd: false,
  isLocked: false,
  isItemFormSessionActive: true,
  collapseDrawerWhileLinking: false,
  collapseDrawerWhileTagging: false,
  isItemDrawerVisible: true,
  showApplyBar: false,
  isInspectorOpen: false,
  pageClassName: 'page',
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
  openClaimerSubstitutionCreate: vi.fn(),
  claimerSubstitutionCreateNonce: 0,
  openClaimerSubstitutionEdit: vi.fn(),
  claimerSubstitutionEditNonce: 0,
  claimerSubstitutionEditId: null,
  deleteClaimerSubstitution: vi.fn(),
  openSubstitutionEdit: vi.fn(),
  deleteSubstitutionOption: vi.fn(),
  clearSubstitutionAutoOpen: vi.fn(),
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
  itemActions: {} as PageTemplateProps['itemActions'],
  confirmAction: null,
  setConfirmAction: vi.fn(),
  isDeactivating: false,
  isActivating: false,
  isDeleting: false,
  handleDeactivateConfirm: vi.fn(),
  handleActivateConfirm: vi.fn(),
  handleDeleteConfirm: vi.fn(),
  handleDuplicate: vi.fn(),
  isDuplicating: false,
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

describe('PageTemplate link apply bar', () => {
  test('shows a bottom Apply button while linking when sidebar stays open', () => {
    render(
      <MemoryRouter>
        <PageTemplate
          {...baseProps}
          isLinkingModeActive
          doesAddSidebarOverlayList={false}
          showApplyBar
          collapseDrawerWhileLinking={false}
          isItemDrawerVisible
          isItemFormSessionActive
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
        <PageTemplate
          {...baseProps}
          isLinkingModeActive
          doesAddSidebarOverlayList
          setIsLinkingModeActive={setIsLinkingModeActive}
          linkedItemIds={['item-a']}
          showApplyBar
          collapseDrawerWhileLinking
          isItemDrawerVisible={false}
          isItemFormSessionActive
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
        <PageTemplate {...baseProps} isLinkingModeActive={false} showApplyBar={false} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('link-apply-bar')).toBeNull();
  });

  test('shows Apply and collapses comments overlay while tagging items', () => {
    const setIsTaggingModeActive = vi.fn();

    render(
      <MemoryRouter>
        <PageTemplate
          {...baseProps}
          isAddOpen={false}
          viewMode="detailed"
          isCommentsOpen
          isTaggingModeActive
          doesAddSidebarOverlayList
          setIsTaggingModeActive={setIsTaggingModeActive}
          showApplyBar
          collapseDrawerWhileTagging
          isItemFormSessionActive={false}
          isItemDrawerVisible={false}
          isInspectorOpen
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
        <PageTemplate
          {...baseProps}
          isAddOpen={false}
          viewMode="detailed"
          isCommentsOpen
          isTaggingModeActive
          doesAddSidebarOverlayList={false}
          showApplyBar={false}
          collapseDrawerWhileTagging={false}
          isItemFormSessionActive={false}
          isInspectorOpen
        />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('link-apply-bar')).toBeNull();
    expect(screen.getByTestId('comments')).toHaveAttribute('data-collapse', 'false');
  });

  test('viewer sees add and auto-add while import stays collaborator-only', () => {
    render(
      <MemoryRouter>
        <PageTemplate
          {...baseProps}
          wishlist={{ ...wishlist, AiEnabled: true }}
          canShowAi
          isOwner={false}
          canCollaborate={false}
          canSuggest
          canAutoAdd
          isAddOpen={false}
          isItemFormSessionActive={false}
          isItemDrawerVisible={false}
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
        <PageTemplate
          {...baseProps}
          wishlist={{ ...wishlist, AiEnabled: false }}
          canShowAi
          isOwner={false}
          canCollaborate={false}
          canSuggest
          canAutoAdd={false}
          isAddOpen={false}
          isItemFormSessionActive={false}
          isItemDrawerVisible={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /add manually/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /auto add from link/i })).not.toBeInTheDocument();
  });

  test('keeps form session props open while linking so the drawer can hide without reset', () => {
    render(
      <MemoryRouter>
        <PageTemplate
          {...baseProps}
          isAddOpen
          isLinkingModeActive
          doesAddSidebarOverlayList
          showApplyBar
          collapseDrawerWhileLinking
          isItemFormSessionActive
          isItemDrawerVisible={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('add-item')).toHaveAttribute('data-session-open', 'true');
  });

  test('renders share modal on desktop when share is open', () => {
    render(
      <MemoryRouter>
        <PageTemplate {...baseProps} isShareOpen isMobileFab={false} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('share-modal')).toBeInTheDocument();
  });

  test('does not render share modal on mobile FAB viewport', () => {
    render(
      <MemoryRouter>
        <PageTemplate {...baseProps} isShareOpen isMobileFab />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('share-modal')).toBeNull();
  });
});
