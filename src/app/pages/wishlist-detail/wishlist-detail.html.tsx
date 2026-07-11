import React from 'react';
import { Link } from 'react-router-dom';
import styles from './wishlist-detail.module.css';
import { Plus, Eye, LayoutList, Rows, LayoutGrid, ArrowLeft } from 'lucide-react';
import { SharePanel } from 'features/wishlists';
import { ItemCard, ItemShowcase } from 'features/items';
import { Button, Modal, Card, LoadingState, ErrorState, EnterPanel } from 'shared/ui';
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
  canCollaborate,
  isExpired,
  isAddOpen,
  setIsAddOpen,
  openAddDrawer,
  editingItem,
  setEditingItem,
  openItemEditor,
  setEditingItemDraft,
  linkedItemIds,
  setLinkedItemIds,
  linkableItems,
  resolvedLinkedItems,
  isLinkingModeActive,
  setIsLinkingModeActive,
  handleLinkingAudienceChange,
  isItemLinkCompatible,
  handleLinkItemToggle,
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
  toggleAiEnabled,
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
  listShares,
  handleItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  handleSelectTag,
  handleSelectReplyTag,
  isLoading,
}) => {
  if (isWishlistLoading) {
    return <LoadingState message="Loading list..." fullHeight />;
  }

  if (wishlistError || !wishlist) {
    return (
      <div className={styles['page-error-state']}>
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
    <div className={styles['app-layout']}>
      {/* LEFT SIDEBAR: Add Item form */}
      <AddItem
        isOpen={isAddOpen || !!editingItem}
        editingItem={editingItem}
        items={items}
        linkableItems={linkableItems}
        resolvedLinkedItems={resolvedLinkedItems}
        linkedItemIds={linkedItemIds}
        setLinkedItemIds={setLinkedItemIds}
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        handleLinkingAudienceChange={handleLinkingAudienceChange}
        isOwner={isOwner}
        listId={wishlist.Id}
        listAiEnabled={!!wishlist.AiEnabled}
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
        listShares={listShares}
        onItemTaggedClick={handleItemTaggedClick}
      />

      <EnterPanel
        animation="fade"
        className={`${styles.container} ${(isAddOpen || !!editingItem) ? styles['add-open'] : ''} ${isCommentsOpen ? styles['comments-open'] : ''}`}
      >
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
          toggleAiEnabled={toggleAiEnabled || (() => {})}
          isCommentsOpen={isCommentsOpen}
          setIsCommentsOpen={setIsCommentsOpen}
          setIsShareOpen={setIsShareOpen}
        />

        {/* Content Layout */}
        <div className={styles['content-layout']}>
          <div className={styles['items-column']}>
            <div className={styles['column-header']}>
              <h3 className={styles['column-title']}>Gift Ideas</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className={styles['view-switcher']}>
                  <button
                    className={`${styles['view-btn']} ${viewMode === 'full' ? styles['view-btn-active'] : ''}`}
                    onClick={() => handleSetViewMode('full')}
                    title="Detailed Card View"
                    aria-label="Detailed Card View"
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    className={`${styles['view-btn']} ${viewMode === 'compact' ? styles['view-btn-active'] : ''}`}
                    onClick={() => handleSetViewMode('compact')}
                    title="Compact Row View"
                    aria-label="Compact Row View"
                  >
                    <Rows size={16} />
                  </button>
                  <button
                    className={`${styles['view-btn']} ${viewMode === 'grid' ? styles['view-btn-active'] : ''}`}
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
                  className={styles['search-input']}
                />
                {canCollaborate && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={openAddDrawer}
                    title="Add Item"
                    style={{ padding: '0.375rem', width: '34px', height: '34px' }}
                  >
                    <Plus size={18} />
                  </Button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className={styles['items-loading']}>
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
                      canCollaborate={canCollaborate}
                      allowGroupFunds={wishlist.AllowGroupFunds}
                      onUpdate={loadData}
                      onEdit={() => openItemEditor(selectedItem)}
                      onClose={() => setSelectedItemId(null)}
                      wishlistItems={items}
                      aiEnabled={wishlist.AiEnabled}
                    />
                  ) : (
                    <div className={styles['grid-preview-placeholder']}>
                      <Eye size={20} className={styles['placeholder-icon']} />
                      <span>Select an item from the gallery below to view details & claims</span>
                    </div>
                  )
                )}

                {items.length > 0 ? (
                  groupedItems.length > 0 ? (
                    <div className={styles['groups-container']}>
                      {groupedItems.map((group) => (
                        <div key={group.categoryKey} className={styles['priority-group']}>
                          <h4 className={styles['priority-group-title']}>
                            {group.label}
                            <span className={styles['group-count']}>{group.items.length}</span>
                          </h4>
                          <div className={
                            viewMode === 'compact'
                              ? styles['items-compact-list']
                              : viewMode === 'grid'
                                ? styles['items-grid-gallery']
                                : styles['items-grid']
                          }>
                            {group.items.map((item) => (
                              <div key={item.Id} id={`item-card-${item.Id}`}>
                                <ItemCard
                                  item={item}
                                  priorityLabel={group.label}
                                  isOwner={isOwner}
                                  isExpired={isExpired}
                                  canCollaborate={canCollaborate}
                                  allowGroupFunds={wishlist.AllowGroupFunds}
                                  onUpdate={loadData}
                                  onEdit={() => openItemEditor(item)}
                                  isTaggingModeActive={
                                    (isAddOpen || !!editingItem)
                                      ? (isLinkingModeActive && (!editingItem || item.Id !== editingItem.Id) && isItemLinkCompatible(item))
                                      : (isTaggingModeActive || isReplyTaggingModeActive)
                                  }
                                  isTaggedSelection={
                                    (isAddOpen || !!editingItem)
                                      ? (isLinkingModeActive && linkedItemIds.includes(item.Id))
                                      : (isReplyTaggingModeActive ? replyTaggedItemIds : taggedItemIds).includes(item.Id)
                                  }
                                  onSelectTag={() => {
                                    if (isAddOpen || !!editingItem) {
                                      if (editingItem && item.Id === editingItem.Id) return;
                                      handleLinkItemToggle(item.Id);
                                    } else if (isReplyTaggingModeActive) {
                                      handleSelectReplyTag(item.Id);
                                    } else {
                                      handleSelectTag(item.Id);
                                    }
                                  }}
                                  viewMode={viewMode}
                                  isSelected={selectedItemId === item.Id}
                                  onSelect={() => setSelectedItemId(item.Id)}
                                  wishlistItems={displayItems}
                                  isLinkingContext={isAddOpen || !!editingItem}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className={styles['empty-items-card']} padding="lg">
                      <p>No items match your search "{searchQuery}".</p>
                      <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
                        Clear Search
                      </Button>
                    </Card>
                  )
                ) : (
                  <Card className={styles['empty-items-card']} padding="lg">
                    <p>This wishlist is currently empty.</p>
                    {canCollaborate && (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus size={14} />}
                        onClick={openAddDrawer}
                      >
                        Add the First Item
                      </Button>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </EnterPanel>

      {/* RIGHT SIDEBAR: Comments & Discussion */}
      <Comments
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        items={displayItems}
        taggedItemIds={taggedItemIds}
        setTaggedItemIds={setTaggedItemIds}
        isTaggingModeActive={isTaggingModeActive}
        setIsTaggingModeActive={setIsTaggingModeActive}
        isReplyTaggingModeActive={isReplyTaggingModeActive}
        setIsReplyTaggingModeActive={setIsReplyTaggingModeActive}
        replyTaggedItemIds={replyTaggedItemIds}
        setReplyTaggedItemIds={setReplyTaggedItemIds}
        listId={wishlist.Id}
        listOwnerId={wishlist.UserId}
        ownerUsername={wishlist.OwnerUsername}
        ownerDisplayName={
          wishlist.OwnerFirstName
            ? wishlist.OwnerFirstName
            : wishlist.OwnerUsername
        }
        isOwner={isOwner}
        handleItemTaggedClick={handleItemTaggedClick}
      />

      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Wishlist"
      >
        <SharePanel
          listId={wishlist.Id}
          isOwner={isOwner}
        />
      </Modal>
    </div>
  );
};
