import React from 'react';
import { ImportStrip } from 'features/items';
import { EnterPanel } from 'shared/ui';
import { DashboardHeader } from './components/header/dashboard-header.component';
import { DashboardControls } from './components/controls/dashboard-controls.component';
import { DashboardWishlistGrid } from './components/wishlist-grid/dashboard-wishlist-grid.component';
import { DashboardCreateModal } from './components/create-modal/dashboard-create-modal.component';
import type { DashboardTemplateProps } from './interfaces/dashboard-template-props.interface';
import styles from './dashboard.module.css';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  greeting,
  isCreateOpen,
  isImportOpen,
  canShowAi,
  importStripRef,
  activeTab,
  searchQuery,
  tabs,
  cards,
  isLoading,
  error,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  showCreateAction,
  gridRef,
  columns,
  onToggleImport,
  onOpenCreate,
  onCloseCreate,
  onTabChange,
  onSearchChange,
  onCreateSuccess,
  onImportStarted,
}) => (
  <EnterPanel animation="fade" className={styles.dashboard}>
    <DashboardHeader
      greeting={greeting}
      isImportOpen={isImportOpen}
      canShowAi={canShowAi}
      onToggleImport={onToggleImport}
      onOpenCreate={onOpenCreate}
    />

    <ImportStrip
      ref={importStripRef}
      mode="create-list"
      isExpanded={isImportOpen}
      onImported={onImportStarted}
    />

    {error ? <div className={styles['dashboard__error']}>{error}</div> : null}

    <DashboardControls
      tabs={tabs}
      activeTab={activeTab}
      searchQuery={searchQuery}
      onTabChange={onTabChange}
      onSearchChange={onSearchChange}
    />

    <DashboardWishlistGrid
      cards={cards}
      isLoading={isLoading}
      emptyIcon={emptyIcon}
      emptyTitle={emptyTitle}
      emptyDesc={emptyDesc}
      showCreateAction={showCreateAction}
      columns={columns}
      gridRef={gridRef}
      onOpenCreate={onOpenCreate}
    />

    <DashboardCreateModal
      isOpen={isCreateOpen}
      onClose={onCloseCreate}
      onSuccess={onCreateSuccess}
    />
  </EnterPanel>
);
