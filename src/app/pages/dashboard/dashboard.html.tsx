import React from 'react';
import { Plus, Upload } from 'lucide-react';
import { WishlistCard, CreateListForm } from 'features/wishlists';
import { ImportStrip } from 'features/items';
import { Button, Badge, Modal, TabBar, SearchInput, EmptyState, LoadingState, EnterPanel } from 'shared/ui';
import styles from './dashboard.module.css';
import { DashboardTemplateProps } from './interfaces/dashboard-template-props.interface';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  getGreeting,
  isCreateOpen,
  setIsCreateOpen,
  isImportOpen,
  setIsImportOpen,
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
          <Badge
            effect="rainbow"
            active={isImportOpen}
            size="compact"
            icon={<Upload size={16} />}
            ariaLabel="Import wishlist"
            ariaPressed={isImportOpen}
            onClick={() => setIsImportOpen(!isImportOpen)}
          />
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
    </EnterPanel>
  );
};
