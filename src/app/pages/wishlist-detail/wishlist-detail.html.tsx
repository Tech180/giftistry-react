import React from 'react';
import { Link } from 'react-router-dom';
import styles from './wishlist-detail.module.css';
import { Plus, Eye, ArrowLeft, ChevronDown, X, MessageSquare, Wand2 } from 'lucide-react';
import { SharePanel } from 'features/wishlists';
import { ItemCard, ItemCardSkeleton, ItemShowcase, getCategoryMeta } from 'features/items';
import { CommentSection } from 'features/comments';
import {
  getItemsContainerClass,
  getLayoutClass,
} from 'features/items/utils/item-view-mode.util';
import { Button, Modal, Card, LoadingState, ErrorState, EnterPanel } from 'shared/ui';
import { WishlistDetailTemplateProps } from './interfaces/wishlist-detail-template-props.interface';
import { AddItem } from './components/drawer/add-item/add-item.component';
import { AddItemWidget } from './components/add-item-widget/add-item-widget.component';
import { Comments } from './components/drawer/comments/comments.component';
import { Header } from './components/header/header.component';
import { ListViewControls } from './components/list-view-controls/list-view-controls.component';
import { ImportStrip } from 'features/items';
import { JobProgressBox } from 'features/jobs';

export const WishlistDetailTemplate: React.FC<WishlistDetailTemplateProps> = ({
  isWishlistLoading,
  wishlistError,
  wishlist,
  items,
  priorities,
  isOwner,
  canCollaborate,
  isExpired,
  isArchived,
  isAddOpen,
  setIsAddOpen,
  openAddDrawer,
  isAutoAddOpen,
  openAutoAdd,
  closeAutoAdd,
  onAutoAddStarted,
  enrichingItemIds,
  editingItem,
  setEditingItem,
  openItemEditor,
  setEditingItemDraft,
  linkedItemIds,
  setLinkedItemIds,
  relatedItemIds,
  setRelatedItemIds,
  linkableItems,
  resolvedLinkedItems,
  resolvedRelatedItems,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  doesAddSidebarOverlayList,
  handleLinkingAudienceChange,
  isItemLinkCompatible,
  handleLinkItemToggle,
  handleRelateItemToggle,
  loadData: _loadData,
  reloadListContent,
  onItemsChange: _onItemsChange,
  itemActions,
  confirmAction,
  setConfirmAction,
  isDeactivating,
  isActivating,
  isDeleting,
  handleDeactivateConfirm,
  handleActivateConfirm,
  handleDeleteConfirm,
  saveTitle,
  saveDate,
  toggleRevealSuggestions,
  toggleAiEnabled,
  toggleWebSearchEnabled,
  toggleManualJobBackground,
  canUseWebSearchOnList = false,
  formatDate,
  isCommentsOpen,
  setIsCommentsOpen,
  isShareOpen,
  setIsShareOpen,
  isImportOpen,
  setIsImportOpen,
  importStripRef,
  viewMode,
  handleSetViewMode,
  searchQuery,
  setSearchQuery,
  selectedItem,
  setSelectedItemId,
  selectedItemId,
  selectedItemPriorityLabel,
  groupedItems,
  collapsedGroupKeys,
  toggleGroupCollapsed,
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
  activeJob,
  isCancellingJob,
  onCancelJob,
  canShowAi = false,
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

  const addItemWidget =
    canCollaborate && !isExpired && !isArchived ? (
      <AddItemWidget
        listId={wishlist.Id}
        isInputMode={isAutoAddOpen}
        onEnterInputMode={openAutoAdd}
        onExitInputMode={closeAutoAdd}
        onManual={openAddDrawer}
        onStarted={onAutoAddStarted}
      />
    ) : null;

  const emptyStateCard = (
    <Card className={styles['empty-items-card']} padding="lg">
      <p>This wishlist is currently empty.</p>
      {canCollaborate && !isArchived && !isExpired && (
        <div className={styles['empty-items-actions']}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Wand2 size={14} />}
            onClick={openAutoAdd}
          >
            Auto Add from Link
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={openAddDrawer}
          >
            Add Manually
          </Button>
        </div>
      )}
    </Card>
  );

  const renderItemCard = (item: typeof items[number], priorityLabel: string) =>
    enrichingItemIds.has(item.Id) ? (
      <ItemCardSkeleton viewMode={viewMode} />
    ) : (
      <ItemCard
        item={item}
        priorityLabel={priorityLabel}
        isOwner={isOwner}
        isExpired={isExpired}
        isArchived={isArchived}
        canCollaborate={canCollaborate && !isArchived}
        allowGroupFunds={wishlist.AllowGroupFunds}
        itemActions={itemActions}
        onEdit={isArchived ? undefined : () => openItemEditor(item)}
        aiEnabled={wishlist.AiEnabled}
        isTaggingModeActive={
          (isAddOpen || !!editingItem)
            ? ((isLinkingModeActive || isRelatingModeActive) &&
                (!editingItem || item.Id !== editingItem.Id) &&
                isItemLinkCompatible(item))
            : (isTaggingModeActive || isReplyTaggingModeActive)
        }
        isTaggedSelection={
          (isAddOpen || !!editingItem)
            ? (
                (isLinkingModeActive && linkedItemIds.includes(item.Id)) ||
                (isRelatingModeActive && relatedItemIds.includes(item.Id))
              )
            : (isReplyTaggingModeActive ? replyTaggedItemIds : taggedItemIds).includes(item.Id)
        }
        onSelectTag={() => {
          if (isAddOpen || !!editingItem) {
            if (editingItem && item.Id === editingItem.Id) return;
            if (isRelatingModeActive) {
              handleRelateItemToggle(item.Id);
            } else {
              handleLinkItemToggle(item.Id);
            }
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
        isLinkingContext={(isAddOpen || !!editingItem) && isLinkingModeActive}
        isRelatingContext={(isAddOpen || !!editingItem) && isRelatingModeActive}
      />
    );

  const isItemFormSessionActive = isAddOpen || !!editingItem;
  const isAssociationModeActive = isLinkingModeActive || isRelatingModeActive;
  const collapseDrawerWhileLinking = isAssociationModeActive && doesAddSidebarOverlayList;
  const isItemDrawerVisible = isItemFormSessionActive && !collapseDrawerWhileLinking;

  return (
    <div className={styles['app-layout']}>
      {/* LEFT SIDEBAR: Add Item form */}
      <AddItem
        isOpen={isItemFormSessionActive}
        editingItem={editingItem}
        items={items}
        linkableItems={linkableItems}
        resolvedLinkedItems={resolvedLinkedItems}
        resolvedRelatedItems={resolvedRelatedItems}
        linkedItemIds={linkedItemIds}
        setLinkedItemIds={setLinkedItemIds}
        relatedItemIds={relatedItemIds}
        setRelatedItemIds={setRelatedItemIds}
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        isRelatingModeActive={isRelatingModeActive}
        setIsRelatingModeActive={setIsRelatingModeActive}
        collapseDrawerWhileLinking={collapseDrawerWhileLinking}
        handleLinkingAudienceChange={handleLinkingAudienceChange}
        isOwner={isOwner}
        listId={wishlist.Id}
        listAiEnabled={!!wishlist.AiEnabled}
        listManualJobBackground={wishlist.ManualJobBackground !== false}
        canUseWebSearchOnList={canUseWebSearchOnList}
        onClose={() => {
          setIsAddOpen(false);
          setEditingItem(null);
          setEditingItemDraft(null);
          setIsLinkingModeActive(false);
          setIsRelatingModeActive(false);
        }}
        onSuccess={() => {
          setIsAddOpen(false);
          setEditingItem(null);
          setEditingItemDraft(null);
          setIsLinkingModeActive(false);
          setIsRelatingModeActive(false);
          void reloadListContent();
        }}
        onAutoEnrichStarted={onAutoAddStarted}
        setEditingItemDraft={setEditingItemDraft}
        loadData={reloadListContent}
        listShares={listShares}
        onItemTaggedClick={handleItemTaggedClick}
      />

      <EnterPanel
        animation="fade"
        className={`${styles.container} ${isItemDrawerVisible ? styles['add-open'] : ''} ${viewMode !== 'grid' && isCommentsOpen ? styles['comments-open'] : ''}`}
      >
        <Header
          wishlist={wishlist}
          items={items}
          priorities={priorities}
          isOwner={isOwner}
          isExpired={isExpired}
          isArchived={isArchived}
          isDeactivating={isDeactivating}
          isActivating={isActivating}
          isDeleting={isDeleting}
          confirmAction={confirmAction}
          setConfirmAction={setConfirmAction}
          handleDeactivateConfirm={handleDeactivateConfirm}
          handleActivateConfirm={handleActivateConfirm}
          handleDeleteConfirm={handleDeleteConfirm}
          saveTitle={saveTitle}
          saveDate={saveDate}
          formatDate={formatDate}
          toggleRevealSuggestions={toggleRevealSuggestions}
          toggleAiEnabled={toggleAiEnabled || (() => {})}
          toggleWebSearchEnabled={toggleWebSearchEnabled || (() => {})}
          toggleManualJobBackground={toggleManualJobBackground || (() => {})}
          isCommentsOpen={isCommentsOpen}
          setIsCommentsOpen={setIsCommentsOpen}
          setIsShareOpen={setIsShareOpen}
          canImport={canCollaborate && !isExpired && !isArchived}
          isImportOpen={isImportOpen}
          onImportToggle={() => setIsImportOpen(!isImportOpen)}
        />

        {wishlist?.Id && canCollaborate && !isExpired && !isArchived ? (
          <ImportStrip
            ref={importStripRef}
            mode="existing-list"
            listId={wishlist.Id}
            isExpanded={isImportOpen}
            onImported={() => {
              setIsImportOpen(false);
              void reloadListContent();
            }}
          />
        ) : null}

        {activeJob &&
        activeJob.Kind === 'wishlist-import' &&
        (activeJob.Status === 'queued' ||
          activeJob.Status === 'running' ||
          activeJob.Status === 'failed' ||
          activeJob.Status === 'cancelled') ? (
          <JobProgressBox
            job={activeJob}
            onCancel={onCancelJob}
            isCancelling={isCancellingJob}
          />
        ) : null}

        {/* Content Layout */}
        {viewMode === 'grid' ? (
          <div className={`${styles.workspace} ${(selectedItemId !== null || isCommentsOpen) ? styles['inspector-open'] : ''}`}>
            {/* Left: Grid Column */}
            <div className={styles['grid-column']}>
              <ListViewControls
                viewMode={viewMode}
                handleSetViewMode={handleSetViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addItemWidget={addItemWidget}
              />

              <div className={styles['grid-items-scroll']}>
              {isLoading ? (
                <div className={styles['items-loading']}>
                  <div className={styles.spinner} />
                </div>
              ) : (
                <>
                  {items.length > 0 ? (
                    groupedItems.length > 0 ? (
                      <div className={`${styles['groups-container']} ${styles['layout-grid']}`}>
                        {groupedItems.map((group) => {
                          const isCollapsed = collapsedGroupKeys.has(group.categoryKey);
                          return (
                            <section
                              key={group.categoryKey}
                              className={`${styles['priority-group']} ${isCollapsed ? styles['priority-group-is-collapsed'] : ''}`}
                              aria-labelledby={`group-${group.categoryKey}`}
                            >
                              <button
                                type="button"
                                id={`group-${group.categoryKey}`}
                                className={styles['priority-group-title']}
                                aria-expanded={!isCollapsed}
                                aria-controls={`group-items-${group.categoryKey}`}
                                onClick={() => toggleGroupCollapsed(group.categoryKey)}
                              >
                                <ChevronDown
                                  size={14}
                                  className={`${styles['group-chevron']} ${isCollapsed ? styles['group-chevron-collapsed'] : ''}`}
                                  aria-hidden="true"
                                />
                                <span className={styles['group-label']}>{group.label}</span>
                                <span className={styles['group-count']}>{group.items.length}</span>
                              </button>
                              {!isCollapsed && (
                                <div
                                  id={`group-items-${group.categoryKey}`}
                                  className={styles['items-container-grid']}
                                >
                                  {group.items.map((item) => (
                                    <div key={item.Id} id={`item-card-${item.Id}`}>
                                      {renderItemCard(item, group.label)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </section>
                          );
                        })}
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
                    emptyStateCard
                  )}
                </>
              )}
              </div>
            </div>

            {/* Right: Unified Inspector Sidebar */}
            <div className={styles['inspector-column']}>
              <aside className={styles['inspector-pane']}>
                {/* View 1: Item Details */}
                {selectedItem && (
                  <div className={`${styles['inspector-view']} ${styles['active']}`}>
                    <div className={styles['inspector-header']}>
                      {(() => {
                        const categoryMeta = getCategoryMeta(selectedItem.Category);
                        const CategoryIcon = categoryMeta.icon;
                        return (
                          <span className={styles['inspector-title']}>
                            <CategoryIcon size={16} aria-hidden />
                            {categoryMeta.label}
                          </span>
                        );
                      })()}
                      <button className={styles['close-btn']} onClick={() => setSelectedItemId(null)}>
                        <X size={16} />
                      </button>
                    </div>
                    <div className={styles['inspector-body']} style={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                      <ItemShowcase
                        key={`preview-${selectedItem.Id}`}
                        item={selectedItem}
                        priorityLabel={selectedItemPriorityLabel}
                        isOwner={isOwner}
                        isExpired={isExpired}
                        isArchived={isArchived}
                        canCollaborate={canCollaborate && !isArchived}
                        allowGroupFunds={wishlist.AllowGroupFunds}
                        itemActions={itemActions}
                        onEdit={() => openItemEditor(selectedItem)}
                        onClose={() => setSelectedItemId(null)}
                        wishlistItems={items}
                        aiEnabled={wishlist.AiEnabled}
                        variant="inline"
                      />
                    </div>
                  </div>
                )}

                {/* View 2: Comments */}
                {isCommentsOpen && (
                  <div className={`${styles['inspector-view']} ${styles['active']}`}>
                    <div className={styles['inspector-header']}>
                      <span className={styles['inspector-title']}>
                        <MessageSquare size={16} /> Discussion
                      </span>
                      <button className={styles['close-btn']} onClick={() => setIsCommentsOpen(false)}>
                        <X size={16} />
                      </button>
                    </div>
                    <div className={styles['inspector-body']}>
                      <CommentSection
                        listId={wishlist.Id}
                        listOwnerId={wishlist.UserId}
                        ownerUsername={wishlist.OwnerUsername}
                        ownerDisplayName={
                          wishlist.OwnerFirstName
                            ? wishlist.OwnerFirstName
                            : wishlist.OwnerUsername
                        }
                        isOwner={isOwner}
                        isExpired={isExpired}
                        isArchived={isArchived}
                        items={displayItems}
                        onItemTaggedClick={handleItemTaggedClick}
                        isTaggingModeActive={isTaggingModeActive}
                        setIsTaggingModeActive={setIsTaggingModeActive}
                        taggedItemIds={taggedItemIds}
                        setTaggedItemIds={setTaggedItemIds}
                        isReplyTaggingModeActive={isReplyTaggingModeActive}
                        setIsReplyTaggingModeActive={setIsReplyTaggingModeActive}
                        replyTaggedItemIds={replyTaggedItemIds}
                        setReplyTaggedItemIds={setReplyTaggedItemIds}
                      />
                    </div>
                  </div>
                )}

              </aside>
            </div>
          </div>
        ) : (
          /* Fallback Content Layout */
          <div className={styles['content-layout']}>
            <div className={styles['items-column']}>
              <ListViewControls
                viewMode={viewMode}
                handleSetViewMode={handleSetViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addItemWidget={addItemWidget}
              />

              {isLoading ? (
                <div className={styles['items-loading']}>
                  <div className={styles.spinner} />
                </div>
              ) : (
                <>
                  {/* Grid View Detail Preview Panel (Fallback for other viewModes if needed, but they don't use grid-preview-container) */}
                  {(viewMode as string) === 'grid' && (
                    selectedItem ? (
                      <div className={styles['grid-preview-container']}>
                        <div className={styles['grid-preview-header']}>
                          <span className={styles['grid-preview-title']}>Item Preview</span>
                          <button
                            type="button"
                            className={styles['close-preview-btn']}
                            onClick={() => setSelectedItemId(null)}
                          >
                            Close
                          </button>
                        </div>
                        <div className={styles['grid-preview-card-wrapper']}>
                          <ItemShowcase
                            key={`preview-${selectedItem.Id}`}
                            item={selectedItem}
                            priorityLabel={selectedItemPriorityLabel}
                            isOwner={isOwner}
                            isExpired={isExpired}
                            isArchived={isArchived}
                            canCollaborate={canCollaborate && !isArchived}
                            allowGroupFunds={wishlist.AllowGroupFunds}
                            itemActions={itemActions}
                            onEdit={() => openItemEditor(selectedItem)}
                            onClose={() => setSelectedItemId(null)}
                            wishlistItems={items}
                            aiEnabled={wishlist.AiEnabled}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles['grid-preview-placeholder']}>
                        <Eye size={20} className={styles['placeholder-icon']} />
                        <span>Select an item from the gallery below to view details & claims</span>
                      </div>
                    )
                  )}

                  {items.length > 0 ? (
                    groupedItems.length > 0 ? (
                      <div className={`${styles['groups-container']} ${styles[getLayoutClass(viewMode)]}`}>
                        {groupedItems.map((group) => {
                          const isCollapsed = collapsedGroupKeys.has(group.categoryKey);
                          return (
                            <section
                              key={group.categoryKey}
                              className={`${styles['priority-group']} ${isCollapsed ? styles['priority-group-is-collapsed'] : ''}`}
                              aria-labelledby={`group-${group.categoryKey}`}
                            >
                              <button
                                type="button"
                                id={`group-${group.categoryKey}`}
                                className={styles['priority-group-title']}
                                aria-expanded={!isCollapsed}
                                aria-controls={`group-items-${group.categoryKey}`}
                                onClick={() => toggleGroupCollapsed(group.categoryKey)}
                              >
                                <ChevronDown
                                  size={16}
                                  className={`${styles['group-chevron']} ${isCollapsed ? styles['group-chevron-collapsed'] : ''}`}
                                  aria-hidden="true"
                                />
                                <span className={styles['group-label']}>{group.label}</span>
                                <span className={styles['group-count']}>{group.items.length}</span>
                              </button>
                              {!isCollapsed && (
                                <div
                                  id={`group-items-${group.categoryKey}`}
                                  className={styles[getItemsContainerClass(viewMode)]}
                                >
                                  {group.items.map((item) => (
                                    <div key={item.Id} id={`item-card-${item.Id}`}>
                                      {renderItemCard(item, group.label)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </section>
                          );
                        })}
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
                    emptyStateCard
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </EnterPanel>

      {/* RIGHT SIDEBAR: Comments & Discussion */}
      {viewMode !== 'grid' && (
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
          isExpired={isExpired}
          isArchived={isArchived}
          handleItemTaggedClick={handleItemTaggedClick}
        />
      )}

      {isItemFormSessionActive && isAssociationModeActive && (
        <div className={styles['link-apply-bar']} data-testid="link-apply-bar">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className={styles['link-apply-btn']}
            onClick={() => {
              setIsLinkingModeActive(false);
              setIsRelatingModeActive(false);
            }}
          >
            Apply
          </Button>
        </div>
      )}

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
