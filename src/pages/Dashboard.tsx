import React, { useEffect, useState } from 'react';
import { Plus, Ghost } from 'lucide-react';
import { useWishlistController, WishlistCard, CreateListForm } from 'features/wishlists';
import { useAuth } from 'app/providers/AuthContext';
import { Button, Modal } from 'shared/ui';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlists, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    fetchWishlists();
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    const name = user?.FirstName || user?.Username || 'there';
    if (hours < 12) return `Good morning, ${name}`;
    if (hours < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Upper header segment */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{getGreeting()}</h1>
          <p className={styles.subtitle}>
            Manage your personal registries and collaborated wishlists
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsCreateOpen(true)}
        >
          New Wishlist
        </Button>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Wishlist grid Section */}
      <div className={styles.gridSection}>
        {isLoading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.skeletonCard} />
            ))}
          </div>
        ) : wishlists.length > 0 ? (
          <div className={styles.grid}>
            {wishlists.map((list) => (
              <WishlistCard key={list.Id} wishlist={list} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <Ghost size={32} className={styles.emptyIcon} />
            </div>
            <h3>No wishlists found</h3>
            <p>Create your first registry to start adding gifts and sharing with friends.</p>
            <Button
              variant="secondary"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreateOpen(true)}
              className={styles.emptyBtn}
            >
              Create Registry
            </Button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Wishlist"
      >
        <CreateListForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
}
