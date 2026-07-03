import React from 'react';
import { Plus } from 'lucide-react';
import { WishlistCard, CreateListForm } from 'features/wishlists';
import { Button, Modal, TabBar, SearchInput, EmptyState, LoadingState } from 'shared/ui';
import styles from './dashboard.module.css';
import { DashboardTemplateProps } from './interfaces/dashboard-template-props.interface';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  getGreeting,
  isCreateOpen,
  setIsCreateOpen,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  tabs,
  currentLists,
  isLoading,
  error,
  handleCreateSuccess,
  emptyIcon,
  emptyTitle,
  emptyDesc,
}) => {
  return (
    <div className={`${styles.container} animate-fade-in`}>
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

      <div className={styles.controlsRow}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        />
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search wishlists..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.gridSection}>
        {isLoading ? (
          <LoadingState message="Loading wishlists..." />
        ) : currentLists.length > 0 ? (
          <div className={styles.grid}>
            {currentLists.map((list) => (
              <WishlistCard key={list.Id} wishlist={list} isArchived={activeTab === 'archive'} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDesc}
            action={
              activeTab === 'my-lists' ? (
                <Button
                  variant="secondary"
                  leftIcon={<Plus size={16} />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create Registry
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Wishlist"
      >
        <CreateListForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
};
