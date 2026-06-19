import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Sparkles, Users, Archive } from 'lucide-react';
import { useWishlistController, WishlistCard, CreateListForm } from 'features/wishlists';
import { useAuth } from 'app/providers/AuthContext';
import { Button, Modal } from 'shared/ui';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlists, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-lists' | 'shared' | 'archive'>('my-lists');
  const [searchQuery, setSearchQuery] = useState('');

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

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Group lists by context
  const { myLists, sharedLists, archivedLists } = useMemo(() => {
    const my: typeof wishlists = [];
    const shared: typeof wishlists = [];
    const archived: typeof wishlists = [];

    wishlists.forEach((list) => {
      if (isExpired(list.ExpiresAt)) {
        archived.push(list);
      } else if (list.Role === 'owner' || !list.Role) {
        my.push(list);
      } else {
        shared.push(list);
      }
    });

    return { myLists: my, sharedLists: shared, archivedLists: archived };
  }, [wishlists]);

  // Filter current list group by search query
  const currentLists = useMemo(() => {
    let lists = [];
    switch (activeTab) {
      case 'shared':
        lists = sharedLists;
        break;
      case 'archive':
        lists = archivedLists;
        break;
      case 'my-lists':
      default:
        lists = myLists;
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return lists.filter((list) =>
        list.Title.toLowerCase().includes(query) ||
        (list.Category && list.Category.toLowerCase().includes(query)) ||
        (list.OwnerFirstName && list.OwnerFirstName.toLowerCase().includes(query))
      );
    }

    return lists;
  }, [activeTab, myLists, sharedLists, archivedLists, searchQuery]);

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

      {/* Segmented Controls & Search Row */}
      <div className={styles.controlsRow}>
        <div className={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('my-lists')}
            className={`${styles.tabButton} ${activeTab === 'my-lists' ? styles.activeTabButton : ''}`}
          >
            My Wishlists
            <span className={`${styles.tabCount} ${activeTab === 'my-lists' ? styles.activeTabCount : styles.inactiveTabCount}`}>
              {myLists.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`${styles.tabButton} ${activeTab === 'shared' ? styles.activeTabButton : ''}`}
          >
            Shared With Me
            <span className={`${styles.tabCount} ${activeTab === 'shared' ? styles.activeTabCount : styles.inactiveTabCount}`}>
              {sharedLists.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`${styles.tabButton} ${activeTab === 'archive' ? styles.activeTabButton : ''}`}
          >
            Archive
            <span className={`${styles.tabCount} ${activeTab === 'archive' ? styles.activeTabCount : styles.inactiveTabCount}`}>
              {archivedLists.length}
            </span>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search wishlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Wishlist grid Section */}
      <div className={styles.gridSection}>
        {isLoading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.skeletonCard} />
            ))}
          </div>
        ) : currentLists.length > 0 ? (
          <div className={styles.grid}>
            {currentLists.map((list) => (
              <WishlistCard key={list.Id} wishlist={list} isArchived={activeTab === 'archive'} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              {activeTab === 'my-lists' ? (
                <Sparkles size={32} className={styles.emptyIcon} />
              ) : activeTab === 'shared' ? (
                <Users size={32} className={styles.emptyIcon} />
              ) : (
                <Archive size={32} className={styles.emptyIcon} />
              )}
            </div>
            <h3 className={styles.emptyTitle}>
              {activeTab === 'my-lists'
                ? 'No active wishlists yet'
                : activeTab === 'shared'
                ? 'No shared lists right now'
                : 'Your archive is empty'}
            </h3>
            <p className={styles.emptyDesc}>
              {activeTab === 'my-lists'
                ? 'Create your first registry to start adding items and sharing with friends.'
                : activeTab === 'shared'
                ? 'When friends share their wishlists with you, they will appear here.'
                : 'Expired registry lists will automatically move here.'}
            </p>
            {activeTab === 'my-lists' && (
              <Button
                variant="secondary"
                leftIcon={<Plus size={16} />}
                onClick={() => setIsCreateOpen(true)}
                className={styles.emptyBtn}
              >
                Create Registry
              </Button>
            )}
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
