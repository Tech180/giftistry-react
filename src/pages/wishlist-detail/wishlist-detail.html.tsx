import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2, Plus, Trash2, Archive, Calendar, Users, Eye, EyeOff, Edit2, MessageSquare, Download, LayoutList, Rows, LayoutGrid } from 'lucide-react';
import { Wishlist, ShareForm, Priority } from 'features/wishlists';
import { ItemCard, AddItemForm, Item, ItemShowcase } from 'features/items';
import { CommentSection } from 'features/comments';
import { Button, Modal, Card, Sidebar, MiniSidebar } from 'shared/ui';
import { exportToCsv, exportToXlsx, exportToTxt, exportToJson } from 'shared/utils/wishlist-export';
import styles from './wishlist-detail.module.css';

interface WishlistDetailTemplateProps {
  wishlist: Wishlist;
  items: Item[];
  priorities: Priority[];
  isOwner: boolean;
  isExpired: boolean;
  isAddOpen: boolean;
  setIsAddOpen: (open: boolean) => void;
  editingItem: Item | null;
  setEditingItem: (item: Item | null) => void;
  setEditingItemDraft: (draft: Partial<Item> | null) => void;
  linkedItemIds: string[];
  setLinkedItemIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  loadData: () => Promise<void>;
  confirmAction: 'deactivate' | 'delete' | null;
  setConfirmAction: (action: 'deactivate' | 'delete' | null) => void;
  isDeactivating: boolean;
  isDeleting: boolean;
  handleDeactivateConfirm: () => void;
  handleDeleteConfirm: () => void;
  isEditingTitle: boolean;
  setIsEditingTitle: (editing: boolean) => void;
  tempTitle: string;
  setTempTitle: (title: string) => void;
  saveTitle: (title: string) => void;
  isEditingDate: boolean;
  setIsEditingDate: (editing: boolean) => void;
  tempDate: string;
  setTempDate: (date: string) => void;
  saveDate: (date: string) => void;
  toggleRevealSuggestions: () => void;
  formatDate: (dateStr: string | null) => string;
  exportRef: React.RefObject<HTMLDivElement | null>;
  isExportDropdownOpen: boolean;
  setIsExportDropdownOpen: (open: boolean) => void;
  isCommentsOpen: boolean;
  setIsCommentsOpen: (open: boolean) => void;
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;
  viewMode: 'full' | 'compact' | 'grid';
  handleSetViewMode: (mode: 'full' | 'compact' | 'grid') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedItem: Item | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItemId: string | null;
  selectedItemPriorityLabel: string | undefined;
  groupedItems: { categoryKey: string; label: string; items: Item[] }[];
  displayItems: Item[];
  handleItemTaggedClick: (itemId: string) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  handleSelectTag: (itemId: string) => void;
  isLoading: boolean;
}

export const WishlistDetailTemplate: React.FC<WishlistDetailTemplateProps> = ({
  wishlist,
  items,
  priorities,
  isOwner,
  isExpired,
  isAddOpen,
  setIsAddOpen,
  editingItem,
  setEditingItem,
  setEditingItemDraft,
  linkedItemIds,
  setLinkedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  loadData,
  confirmAction,
  setConfirmAction,
  isDeactivating,
  isDeleting,
  handleDeactivateConfirm,
  handleDeleteConfirm,
  isEditingTitle,
  setIsEditingTitle,
  tempTitle,
  setTempTitle,
  saveTitle,
  isEditingDate,
  setIsEditingDate,
  tempDate,
  setTempDate,
  saveDate,
  toggleRevealSuggestions,
  formatDate,
  exportRef,
  isExportDropdownOpen,
  setIsExportDropdownOpen,
  isCommentsOpen,
  setIsCommentsOpen,
  isShareOpen,
  setIsShareOpen,
  viewMode,
  handleSetViewMode,
  searchQuery,
  setSearchQuery,
  selectedItem,
  setSelectedItemId,
  selectedItemId,
  selectedItemPriorityLabel,
  groupedItems,
  displayItems,
  handleItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  handleSelectTag,
  isLoading,
}) => {
  return (
    <div className={styles.appLayout}>
      {/* LEFT SIDEBAR: Add Item form */}
      <Sidebar
        isOpen={isAddOpen || !!editingItem}
        position="left"
        title={editingItem ? 'Edit Gift Item' : 'Add Item to Wishlist'}
        onClose={() => {
          setIsAddOpen(false);
          setEditingItem(null);
          setEditingItemDraft(null);
        }}
        overflowVisible={true}
        miniSidebar={
          <MiniSidebar
            items={items}
            selectedIds={linkedItemIds}
            onRemoveId={(id) => setLinkedItemIds(prev => prev.filter(lid => lid !== id))}
            isActive={isLinkingModeActive}
            position="left"
            label="Linked"
          />
        }
      >
        <AddItemForm
          listId={wishlist.Id}
          isOwner={isOwner}
          item={editingItem}
          existingCategories={Array.from(new Set(items.map(item => item.Category).filter(Boolean)))}
          onDraftChange={setEditingItemDraft}
          wishlistItems={items}
          linkedItemIds={linkedItemIds}
          setLinkedItemIds={setLinkedItemIds}
          isLinkingModeActive={isLinkingModeActive}
          setIsLinkingModeActive={setIsLinkingModeActive}
          onPriorityChange={loadData}
          isOpen={isAddOpen || !!editingItem}
          onSuccess={() => {
            setIsAddOpen(false);
            setEditingItem(null);
            setEditingItemDraft(null);
            loadData();
          }}
        />
      </Sidebar>

      <div className={`${styles.container} animate-fade-in ${(isAddOpen || !!editingItem) ? styles.addOpen : ''} ${isCommentsOpen ? styles.commentsOpen : ''}`}>
        {confirmAction && (
          <div className={styles['confirm-banner']}>
            <span className={styles['confirm-text']}>
              {confirmAction === 'deactivate'
                ? 'Are you sure you want to deactivate and archive this wishlist?'
                : 'Are you sure you want to permanently delete this wishlist and all of its items?'}
            </span>
            <div className={styles['confirm-buttons']}>
              <button
                onClick={confirmAction === 'deactivate' ? handleDeactivateConfirm : handleDeleteConfirm}
                className={`${styles['confirm-btn']} ${styles['yes-btn']}`}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className={`${styles['confirm-btn']} ${styles['no-btn']}`}
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Navigation Breadcrumb & Deactivate/Delete Action */}
        <div className={styles['top-row']}>
          <Link to="/dashboard" className={styles.backLink}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          {isOwner && (
            <div className={styles['top-actions']}>
              <button
                onClick={() => setConfirmAction('deactivate')}
                disabled={isDeactivating || isDeleting}
                className={styles['archive-btn']}
                title="Deactivate / Archive Wishlist"
              >
                <Archive size={16} />
              </button>
              <button
                onClick={() => setConfirmAction('delete')}
                disabled={isDeactivating || isDeleting}
                className={styles['deactivate-trash-btn']}
                title="Delete Wishlist and Items"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Main Details Banner */}
        <div className={styles.header}>
          <div className={styles.headerMeta}>
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => saveTitle(tempTitle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveTitle(tempTitle);
                  } else if (e.key === 'Escape') {
                    setTempTitle(wishlist.Title);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className={styles['inline-title-input']}
              />
            ) : (
              <h1 className={styles.title}>
                {wishlist.Title}
                {isOwner && (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className={styles['edit-title-btn']}
                    title="Rename wishlist"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </h1>
            )}
            <div className={styles.metaRow}>
              {isEditingDate ? (
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => saveDate(e.target.value)}
                  onBlur={() => setIsEditingDate(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
                      setTempDate(prevDateStr);
                      setIsEditingDate(false);
                    }
                  }}
                  autoFocus
                  className={styles['inline-date-input']}
                />
              ) : isOwner ? (
                <button
                  className={styles['calendar-btn']}
                  onClick={() => setIsEditingDate(true)}
                  title="Change expiration date"
                >
                  <Calendar size={14} />
                  <span>{formatDate(wishlist.ExpiresAt)}</span>
                  {isExpired && <span className={styles.expiredLabel}>(Expired)</span>}
                </button>
              ) : (
                <div className={styles.metaItem}>
                  <Calendar size={14} />
                  <span>{formatDate(wishlist.ExpiresAt)}</span>
                  {isExpired && <span className={styles.expiredLabel}>(Expired)</span>}
                </div>
              )}
              {wishlist.AllowGroupFunds && (
                <div className={styles.metaItem}>
                  <Users size={14} />
                  <span>Group Funding Enabled</span>
                </div>
              )}
              {isOwner && (
                <button
                  className={styles['settings-btn']}
                  onClick={toggleRevealSuggestions}
                  title="Toggle suggestion visibility after list expiration"
                >
                  {wishlist.RevealSuggestions ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{wishlist.RevealSuggestions ? 'Reveal suggestions after expiration' : 'Hide suggestions permanently'}</span>
                </button>
              )}
              {!isOwner && (
                <div className={styles.metaItem}>
                  <Eye size={14} />
                  <span>Owner: {wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner'}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            {wishlist && (
              <div className={styles.exportDropdownContainer} ref={exportRef} title="Export">
                <Button
                  variant="secondary"
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  aria-label="Export"
                >
                  <Download size={16} />
                </Button>
                {isExportDropdownOpen && (
                  <div className={styles.exportDropdownMenu}>
                    <button
                      className={styles.exportDropdownItem}
                      onClick={() => {
                        exportToCsv(
                          wishlist.Title,
                          items,
                          priorities,
                          wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      CSV
                    </button>
                    <button
                      className={styles.exportDropdownItem}
                      onClick={() => {
                        exportToXlsx(
                          wishlist.Title,
                          items,
                          priorities,
                          wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      XLSX
                    </button>
                    <button
                      className={styles.exportDropdownItem}
                      onClick={() => {
                        exportToTxt(
                          wishlist.Title,
                          items,
                          priorities,
                          wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      TXT
                    </button>
                    <button
                      className={styles.exportDropdownItem}
                      onClick={() => {
                        exportToJson(
                          wishlist.Title,
                          items,
                          priorities,
                          wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      JSON
                    </button>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="secondary"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              title="Discussion"
              aria-label="Discussion"
            >
              <MessageSquare size={16} />
            </Button>
            {isOwner && (
              <Button
                variant="secondary"
                onClick={() => setIsShareOpen(true)}
                title="Share Registry"
                aria-label="Share Registry"
              >
                <Share2 size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className={styles.contentLayout}>
          <div className={styles.itemsColumn}>
            <div className={styles.columnHeader}>
              <h3 className={styles.columnTitle}>Gift Ideas</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className={styles.viewSwitcher}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'full' ? styles.viewBtnActive : ''}`}
                    onClick={() => handleSetViewMode('full')}
                    title="Detailed Card View"
                    aria-label="Detailed Card View"
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'compact' ? styles.viewBtnActive : ''}`}
                    onClick={() => handleSetViewMode('compact')}
                    title="Compact Row View"
                    aria-label="Compact Row View"
                  >
                    <Rows size={16} />
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                    onClick={() => handleSetViewMode('grid')}
                    title="Grid Gallery View"
                    aria-label="Grid Gallery View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddOpen(true)}
                  title="Add Item"
                  style={{ padding: '0.375rem', width: '34px', height: '34px' }}
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className={styles.itemsLoading}>
                <div className={styles.spinner} />
              </div>
            ) : (
              <>
                {/* Grid View Detail Preview Panel */}
                {viewMode === 'grid' && (
                  selectedItem ? (
                    <ItemShowcase
                      key={`preview-${selectedItem.Id}`}
                      item={selectedItem}
                      priorityLabel={selectedItemPriorityLabel}
                      isOwner={isOwner}
                      isExpired={isExpired}
                      canCollaborate={isOwner || wishlist.Role === 'collaborator'}
                      allowGroupFunds={wishlist.AllowGroupFunds}
                      onUpdate={loadData}
                      onEdit={() => setEditingItem(selectedItem)}
                      onClose={() => setSelectedItemId(null)}
                      wishlistItems={items}
                    />
                  ) : (
                    <div className={styles.gridPreviewPlaceholder}>
                      <Eye size={20} className={styles.placeholderIcon} />
                      <span>Select an item from the gallery below to view details & claims</span>
                    </div>
                  )
                )}

                {items.length > 0 ? (
                  groupedItems.length > 0 ? (
                    <div className={styles.groupsContainer}>
                      {groupedItems.map((group) => (
                        <div key={group.categoryKey} className={styles.priorityGroup}>
                          <h4 className={styles.priorityGroupTitle}>
                            {group.label}
                            <span className={styles.groupCount}>{group.items.length}</span>
                          </h4>
                          <div className={
                            viewMode === 'compact'
                              ? styles.itemsCompactList
                              : viewMode === 'grid'
                                ? styles.itemsGridGallery
                                : styles.itemsGrid
                          }>
                            {group.items.map((item) => (
                              <div key={item.Id} id={`item-card-${item.Id}`}>
                                <ItemCard
                                  item={item}
                                  priorityLabel={group.label}
                                  isOwner={isOwner}
                                  isExpired={isExpired}
                                  canCollaborate={isOwner || wishlist.Role === 'collaborator'}
                                  allowGroupFunds={wishlist.AllowGroupFunds}
                                  onUpdate={loadData}
                                  onEdit={() => setEditingItem(item)}
                                  isTaggingModeActive={
                                    (isAddOpen || !!editingItem)
                                      ? (isLinkingModeActive && (!editingItem || item.Id !== editingItem.Id))
                                      : isTaggingModeActive
                                  }
                                  isTaggedSelection={
                                    (isAddOpen || !!editingItem)
                                      ? linkedItemIds.includes(item.Id)
                                      : taggedItemIds.includes(item.Id)
                                  }
                                  onSelectTag={() => {
                                    if (isAddOpen || !!editingItem) {
                                      if (editingItem && item.Id === editingItem.Id) return;
                                      setLinkedItemIds((prev) =>
                                        prev.includes(item.Id)
                                          ? prev.filter((id) => id !== item.Id)
                                          : [...prev, item.Id]
                                      );
                                    } else {
                                      handleSelectTag(item.Id);
                                    }
                                  }}
                                  viewMode={viewMode}
                                  isSelected={selectedItemId === item.Id}
                                  onSelect={() => setSelectedItemId(item.Id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className={styles.emptyItemsCard} padding="lg">
                      <p>No items match your search "{searchQuery}".</p>
                      <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    </Card>
                  )
                ) : (
                  <Card className={styles.emptyItemsCard} padding="lg">
                    <p>This wishlist is currently empty.</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus size={14} />}
                      onClick={() => setIsAddOpen(true)}
                    >
                      Add the First Item
                    </Button>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Comments & Discussion */}
      <Sidebar
        isOpen={isCommentsOpen}
        position="right"
        title="Comments"
        onClose={() => setIsCommentsOpen(false)}
        overflowVisible={true}
        miniSidebar={
          <MiniSidebar
            items={displayItems}
            selectedIds={taggedItemIds}
            onRemoveId={(id) => setTaggedItemIds(taggedItemIds.filter((tid) => tid !== id))}
            isActive={isTaggingModeActive}
            position="right"
            label="Tags"
          />
        }
      >
        <CommentSection
          listId={wishlist.Id}
          isOwner={isOwner}
          items={displayItems}
          onItemTaggedClick={handleItemTaggedClick}
          isTaggingModeActive={isTaggingModeActive}
          setIsTaggingModeActive={setIsTaggingModeActive}
          taggedItemIds={taggedItemIds}
          setTaggedItemIds={setTaggedItemIds}
        />
      </Sidebar>

      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Wishlist"
      >
        <ShareForm
          listId={wishlist.Id}
          onSuccess={() => {
            // Keep modal open so they see success alert, then auto-closes
          }}
        />
      </Modal>
    </div>
  );
};
