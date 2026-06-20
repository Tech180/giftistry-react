import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectTag = useCallback((itemId: string) => {
    setTaggedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const loadData = useCallback(async () => {
    if (!listId) return;
    setIsWishlistLoading(true);
    setWishlistError(null);
    try {
      const [wl, prio] = await Promise.all([
        wishlistsApi.getWishlist(listId),
        wishlistsApi.listPriorities(listId)
      ]);
      setWishlist(wl);
      setPriorities(prio || []);
      const expiresAtIso = wl.ExpiresAt ? new Date(wl.ExpiresAt).toISOString().split('T')[0] : '';
      setTempDate(expiresAtIso);
      setTempTitle(wl.Title);
      await fetchItems(listId);
    } catch (err) {
      setWishlistError(err instanceof Error ? err.message : 'Failed to load wishlist.');
    } finally {
      setIsWishlistLoading(false);
    }
  }, [listId, fetchItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isOwner = useMemo(() => {
    return !!(wishlist && user && wishlist.UserId === user.Id);
  }, [wishlist, user]);

  const isExpired = useMemo(() => {
    return !!(wishlist?.ExpiresAt ? new Date() > new Date(wishlist.ExpiresAt) : false);
  }, [wishlist]);

  const saveTitle = async (newTitle: string) => {
    if (!wishlist) return;
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setTempTitle(wishlist.Title);
      setIsEditingTitle(false);
      return;
    }
    if (trimmed === wishlist.Title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        trimmed,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        wishlist.RevealSuggestions
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update title');
      setTempTitle(wishlist.Title);
    } finally {
      setIsEditingTitle(false);
    }
  };

  const handleItemTaggedClick = useCallback((itemId: string) => {
    const element = document.getElementById(`item-card-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add(styles.itemCardWrapperHighlighted);
      setTimeout(() => {
        element.classList.remove(styles.itemCardWrapperHighlighted);
      }, 1500);
    }
  }, []);

  const saveDate = async (newDateStr: string) => {
    if (!wishlist) return;
    const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
    if (newDateStr === prevDateStr) {
      setIsEditingDate(false);
      return;
    }
    try {
      const expiresAtIso = newDateStr ? new Date(newDateStr).toISOString() : null;
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        expiresAtIso,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        wishlist.RevealSuggestions
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update date');
      setTempDate(prevDateStr);
    } finally {
      setIsEditingDate(false);
    }
  };

  const toggleRevealSuggestions = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        !wishlist.RevealSuggestions
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update suggestion visibility');
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!wishlist) return;
    
    setIsDeactivating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deactivateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deactivation failed.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!wishlist) return;

    setIsDeleting(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deleteWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  const [editingItemDraft, setEditingItemDraft] = useState<Partial<Item> | null>(null);

  const displayItems = useMemo(() => {
    return items.map((item) => {
      if (editingItem && editingItemDraft && item.Id === editingItem.Id) {
        return {
          ...item,
          ...editingItemDraft,
          Links: editingItemDraft.Links ? editingItemDraft.Links : item.Links
        };
      }
      return item;
    });
  }, [items, editingItem, editingItemDraft]);

  const groupedItems = useMemo(() => {
    const filtered = displayItems.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        item.Name.toLowerCase().includes(query) ||
        (item.Description && item.Description.toLowerCase().includes(query))
      );
    });

    const priorityMap = new Map<string, Priority>();
    for (const p of priorities) {
      priorityMap.set(p.Id, p);
    }

    const groups: { [key: string]: { priority: Priority | null; items: Item[] } } = {};

    for (const p of priorities) {
      groups[p.Id] = { priority: p, items: [] };
    }
    
    const uncategorizedKey = 'uncategorized';
    groups[uncategorizedKey] = { priority: null, items: [] };

    for (const item of filtered) {
      const key = item.PriorityId && groups[item.PriorityId] ? item.PriorityId : uncategorizedKey;
      groups[key].items.push(item);
    }

    return Object.values(groups)
      .filter((g) => g.items.length > 0)
      .sort((a, b) => {
        if (!a.priority) return 1;
        if (!b.priority) return -1;
        return b.priority.Weight - a.priority.Weight;
      });
  }, [displayItems, priorities, searchQuery]);

  if (isWishlistLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Loading registry details...</p>
      </div>
    );
  }

  if (wishlistError || !wishlist) {
    return (
      <div className={styles.errorState}>
        <h3>Wishlist Not Found</h3>
        <p>{wishlistError || 'This wishlist does not exist or you do not have permission to view it.'}</p>
        <Link to="/dashboard">
          <Button variant="secondary" leftIcon={<ArrowLeft size={16} />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'No expiration date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
      >
        <AddItemForm
          listId={wishlist.Id}
          isOwner={isOwner}
          item={editingItem}
          existingCategories={Array.from(new Set(items.map(item => item.Category).filter(Boolean)))}
          onDraftChange={setEditingItemDraft}
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
            
            {isItemsLoading ? (
              <div className={styles.itemsLoading}>
                <div className={styles.spinner} />
              </div>
            ) : items.length > 0 ? (
              groupedItems.length > 0 ? (
                <div className={styles.groupsContainer}>
                  {groupedItems.map((group) => (
                    <div key={group.priority?.Id || 'uncategorized'} className={styles.priorityGroup}>
                      <h4 className={styles.priorityGroupTitle}>
                        {group.priority ? group.priority.Label : 'General Items'}
                        <span className={styles.groupCount}>{group.items.length}</span>
                      </h4>
                      <div className={styles.itemsGrid}>
                        {group.items.map((item) => (
                          <div key={item.Id} id={`item-card-${item.Id}`}>
                            <ItemCard
                              item={item}
                              priorityLabel={group.priority?.Label || undefined}
                              isOwner={isOwner}
                              isExpired={isExpired}
                              canCollaborate={isOwner || wishlist.Role === 'collaborator'}
                              allowGroupFunds={wishlist.AllowGroupFunds}
                              onUpdate={loadData}
                              onEdit={() => setEditingItem(item)}
                              isTaggingModeActive={isTaggingModeActive}
                              isTaggedSelection={taggedItemIds.includes(item.Id)}
                              onSelectTag={() => handleSelectTag(item.Id)}
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
}

