import React from 'react';
import { Search } from 'lucide-react';
import { Button } from 'shared/ui';
import { PackDirectoryRow } from '../pack-directory-row/pack-directory-row.component';
import { WorkspaceViewHeader } from '../workspace-view-header/workspace-view-header.component';
import type { DirectoryWorkspacePaneProps } from './interfaces/directory-workspace-pane-props.interface';
import styles from './directory-workspace-pane.module.css';

export const DirectoryWorkspacePaneTemplate: React.FC<DirectoryWorkspacePaneProps> = ({
  items,
  searchQuery,
  searchId,
  emptyMessage,
  isLoading,
  error,
  disabled,
  onSearchChange,
  onSelectPack,
  onTogglePack,
  onCreatePack,
}) => {
  return (
    <>
      <WorkspaceViewHeader
        heading="Packs"
        actions={
          <div className={styles['header-actions']}>
            <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={onCreatePack}>
              Create Pack
            </Button>
            <div className={styles['search-wrapper']}>
              <label htmlFor={searchId} className={styles['sr-only']}>
                Search packs
              </label>
              <Search className={styles['search-icon']} size={14} aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                className={styles['search-input']}
                placeholder="Search packs..."
                value={searchQuery}
                disabled={disabled}
                autoComplete="off"
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </div>
        }
      />
      {isLoading && <p className={styles.status}>Loading packs…</p>}
      {error && <p className={styles.status}>{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <div className={styles['empty-state']}>{emptyMessage}</div>
      )}
      {!isLoading && !error && items.length > 0 && (
        <div className={styles['pack-list']}>
          {items.map((item) => (
            <PackDirectoryRow
              key={item.pack.Id}
              pack={item.pack}
              enabled={item.enabled}
              categoryLabel={item.categoryLabel}
              isTechnology={item.isTechnology}
              disabled={disabled}
              onView={() => onSelectPack(item.pack.Id)}
              onToggle={(next) => onTogglePack(item.pack.Id, next)}
            />
          ))}
        </div>
      )}
    </>
  );
};
