import React from 'react';
import { Link } from 'react-router-dom';
import styles from './wishlist-detail.module.css';
import { Plus, Eye, LayoutList, Rows, LayoutGrid, ArrowLeft } from 'lucide-react';
import { ShareForm } from 'features/wishlists';
import { ItemCard, ItemShowcase } from 'features/items';
import { Button, Modal, Card, LoadingState, ErrorState } from 'shared/ui';
import { WishlistDetailTemplateProps } from './interfaces/wishlist-detail-template-props.interface';
import { AddItem } from './components/drawer/add-item/add-item.component';
import { Comments } from './components/drawer/comments/comments.component';
import { Header } from './components/header/header.component';


export const WishlistDetailTemplate: React.FC<WishlistDetailTemplateProps> = ({
  isWishlistLoading,
  wishlistError,
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
  saveTitle,
  saveDate,
  toggleRevealSuggestions,
  formatDate,
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
  if (isWishlistLoading) {
    return <LoadingState message="Loading registry details..." fullHeight />;
  }

  if (wishlistError || !wishlist) {
    return (
      <div className={styles.pageErrorState}>
        <ErrorState
          message={wishlistError || 'This wishlist does not exist or you do not have permission to view it.'}
        />
        <Link to="/dashboard">
          <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.appLayout}>
      {/* LEFT SIDEBAR: Add Item form */}
      <AddItem
        isOpen={isAddOpen || !!editingItem}
        editingItem={editingItem}
        items={items}
        linkedItemIds={linkedItemIds}
        setLinkedItemIds={setLinkedItemIds}
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        isOwner={isOwner}
        listId={wishlist.Id}
        onClose={() => {
          setIsAddOpen(false);
          setEditingItem(null);
          setEditingItemDraft(null);
        }}
        onSuccess={() => {
          setIsAddOpen(false);
          setEditingItem(null);
          setEditingItemDraft(null);
          loadData();
        }}
        setEditingItemDraft={setEditingItemDraft}
        loadData={loadData}
      />

      <div className={`${styles.container} animate-fade-in ${(isAddOpen || !!editingItem) ? styles.addOpen : ''} ${isCommentsOpen ? styles.commentsOpen : ''}`}>
        <Header
          wishlist={wishlist}
          items={items}
          priorities={priorities}
          isOwner={isOwner}
          isExpired={isExpired}
          isDeactivating={isDeactivating}
          isDeleting={isDeleting}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          handleDeactivateConfirm={handleDeactivateConfirm}
          handleDeleteConfirm={handleDeleteConfirm}
          saveTitle={saveTitle}
          saveDate={saveDate}
          formatDate={formatDate}
          toggleRevealSuggestions={toggleRevealSuggestions}
          isCommentsOpen={isCommentsOpen}
          setIsCommentsOpen={setIsCommentsOpen}
          setIsShareOpen={setIsShareOpen}
        />

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
      <Comments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        items={displayItems}
        taggedItemIds={taggedItemIds}
        setTaggedItemIds={setTaggedItemIds}
        isTaggingModeActive={isTaggingModeActive}
        setIsTaggingModeActive={setIsTaggingModeActive}
        listId={wishlist.Id}
        isOwner={isOwner}
        handleItemTaggedClick={handleItemTaggedClick}
      />

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
