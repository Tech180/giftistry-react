import React from 'react';
import { Plus, Upload } from 'lucide-react';
import { WishlistCard, CreateListForm } from 'features/wishlists';
import { ImportStrip } from 'features/items/components/import/import-strip/import-strip.component';
import { Button, Modal, TabBar, SearchInput, EmptyState, LoadingState, EnterPanel } from 'shared/ui';
import styles from './dashboard.module.css';
import { DashboardTemplateProps } from './interfaces/dashboard-template-props.interface';
import { isWishlistInArchiveBucket } from 'features/wishlists/utils/is-wishlist-in-archive-bucket.util';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  getGreeting,
  isCreateOpen,
  setIsCreateOpen,
  isImportOpen,
  setIsImportOpen,
  canShowAi,
  importStripRef,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  tabs,
  currentLists,
  isLoading,
  error,
  handleCreateSuccess,
  handleImportStarted,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  gridRef,
  columns,
}) => {
  return (
    <EnterPanel animation="fade" className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{getGreeting()}</h1>
          <p className={styles.subtitle}>
            Manage your personal registries and collaborated wishlists
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.headerImportAction}>
            <Button
              variant="secondary"
              onClick={() => setIsImportOpen(!isImportOpen)}
              aria-label="Import wishlist"
              aria-pressed={isImportOpen}
              effect={canShowAi ? 'rainbow' : 'none'}
            >
              <Upload size={16} />
            </Button>
          </span>
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Wishlist
          </Button>
        </div>
      </div>

      <ImportStrip
        ref={importStripRef}
        mode="create-list"
        isExpanded={isImportOpen}
        onImported={handleImportStarted}
      />

      {error && <div className={styles['error-banner']}>{error}</div>}

      <div className={styles['controls-row']}>
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        />
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search wishlists..."
          className={styles['search-input']}
        />
      </div>

      <div className={styles['grid-section']}>
        {isLoading ? (
          <LoadingState message="Loading wishlists..." />
        ) : currentLists.length > 0 ? (
          <div className={styles.grid} ref={gridRef} data-columns={columns}>
            {currentLists.map((list) => (
              <WishlistCard
                key={list.Id}
                wishlist={list}
                isArchived={isWishlistInArchiveBucket(list)}
              />
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
        title="Create new wishlist"
        subtitle="Configure details and advanced settings."
      >
        <CreateListForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>
    </EnterPanel>
  );
};
