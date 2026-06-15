import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Plus, Archive, Calendar, Users, Eye } from 'lucide-react';
import { wishlistsApi, Wishlist, ShareForm } from 'features/wishlists';
import { useItemController, ItemCard, AddItemForm } from 'features/items';
import { CommentSection } from 'features/comments';
import { useAuth } from 'app/providers/AuthContext';
import { Button, Modal, Card } from 'shared/ui';
import styles from './WishlistDetail.module.css';

export default function WishlistDetail() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const { items, isLoading: isItemsLoading, fetchItems } = useItemController();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const loadData = useCallback(async () => {
    if (!listId) return;
    setIsWishlistLoading(true);
    setWishlistError(null);
    try {
      const data = await wishlistsApi.getWishlist(listId);
      setWishlist(data);
      await fetchItems(listId);
    } catch (err) {
      setWishlistError(err instanceof Error ? err.message : 'Failed to load wishlist details.');
    } finally {
      setIsWishlistLoading(false);
    }
  }, [listId, fetchItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeactivate = async () => {
    if (!wishlist || !window.confirm('Are you sure you want to deactivate and archive this wishlist?')) return;
    
    setIsDeactivating(true);
    try {
      await wishlistsApi.deactivateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deactivation failed.');
    } finally {
      setIsDeactivating(false);
    }
  };

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

  const isOwner = user?.Id === wishlist.UserId;
  const isExpired = wishlist.ExpiresAt ? new Date() > new Date(wishlist.ExpiresAt) : false;

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
    <div className={`${styles.container} animate-fade-in`}>
      {/* Navigation Breadcrumb */}
      <Link to="/dashboard" className={styles.backLink}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Main Details Banner */}
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          <h1 className={styles.title}>{wishlist.Title}</h1>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <Calendar size={14} />
              <span>{formatDate(wishlist.ExpiresAt)}</span>
              {isExpired && <span className={styles.expiredLabel}>(Expired)</span>}
            </div>
            {wishlist.AllowGroupFunds && (
              <div className={styles.metaItem}>
                <Users size={14} />
                <span>Group Funding Enabled</span>
              </div>
            )}
            {!isOwner && (
              <div className={styles.metaItem}>
                <Eye size={14} />
                <span>Owner's Registry</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {isOwner && (
            <>
              <Button
                variant="secondary"
                leftIcon={<Share2 size={16} />}
                onClick={() => setIsShareOpen(true)}
              >
                Share Registry
              </Button>
              <Button
                variant="ghost"
                leftIcon={<Archive size={16} />}
                onClick={handleDeactivate}
                isLoading={isDeactivating}
                className={styles.deactivateBtn}
              >
                Deactivate
              </Button>
            </>
          )}
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddOpen(true)}
          >
            Add Gift Item
          </Button>
        </div>
      </div>

      {/* Two Column Layout: Items on Left, Discussion/Comments on Right */}
      <div className={styles.contentLayout}>
        <div className={styles.itemsColumn}>
          <h3 className={styles.columnTitle}>Gift Registry Items ({items.length})</h3>
          
          {isItemsLoading ? (
            <div className={styles.itemsLoading}>
              <div className={styles.spinner} />
            </div>
          ) : items.length > 0 ? (
            <div className={styles.itemsGrid}>
              {items.map((item) => (
                <ItemCard
                  key={item.Id}
                  item={item}
                  isOwner={isOwner}
                  isExpired={isExpired}
                  canCollaborate={true}
                  allowGroupFunds={wishlist.AllowGroupFunds}
                  onUpdate={loadData}
                />
              ))}
            </div>
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

        {/* Discussion / Comments Section */}
        <div className={styles.commentsColumn}>
          <CommentSection listId={wishlist.Id} isOwner={isOwner} />
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Item to Wishlist"
      >
        <AddItemForm
          listId={wishlist.Id}
          isOwner={isOwner}
          onSuccess={() => {
            setIsAddOpen(false);
            loadData();
          }}
        />
      </Modal>

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
