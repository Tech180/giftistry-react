import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Switch } from 'shared/ui';
import { UserPreviewCard } from 'shared/ui/user-preview-card/user-preview-card.component';
import { AudiencePickerTemplateProps } from './interfaces/audience-picker-template-props.interface';
import styles from './audience-picker.module.css';

const SEARCH_THRESHOLD = 5;

export const AudiencePickerTemplate: React.FC<AudiencePickerTemplateProps> = ({
  listShares,
  visibilityMode,
  search,
  setSearch,
  onVisibilityModeChange,
  onToggleUser,
  selectedUserIds,
  disabled,
  getDisplayName,
  getInitials,
  filteredShares,
}) => {
  const hasShares = listShares.length > 0;
  const showSearch = hasShares && listShares.length > SEARCH_THRESHOLD;

  return (
    <div className={styles.section} aria-labelledby="audience-picker-label">
      <div className={styles['header-row']}>
        <span id="audience-picker-label" className={styles.label}>
          Visibility &amp; Sharing
        </span>
        {visibilityMode === 'restricted' && selectedUserIds.length === 0 && (
          <div className={styles['warning-badge']}>
            <AlertTriangle size={14} className={styles['warning-icon']} />
            <span className={styles['warning-text']}>Select at least one</span>
          </div>
        )}
      </div>

      {visibilityMode === 'private' && (
        <p className={styles['helper-text']}>
          This item will be hidden from everyone else on this list.
        </p>
      )}

      {visibilityMode !== 'private' && !hasShares && (
        <p className={styles['helper-text']}>
          Share the list first to restrict items to specific people.
        </p>
      )}

      <div className={visibilityMode === 'restricted' && !hasShares ? styles['disabled-overlay'] : undefined}>
        <div className={styles['segmented-control']} role="radiogroup" aria-label="Visibility mode">
          <button
            type="button"
            className={`${styles.segment} ${visibilityMode === 'everyone' ? styles['segment-active'] : ''}`}
            onClick={() => onVisibilityModeChange('everyone')}
            disabled={disabled}
            aria-pressed={visibilityMode === 'everyone'}
          >
            Everyone
          </button>
          <button
            type="button"
            className={`${styles.segment} ${visibilityMode === 'restricted' ? styles['segment-active'] : ''}`}
            onClick={() => onVisibilityModeChange('restricted')}
            disabled={disabled || !hasShares}
            aria-pressed={visibilityMode === 'restricted'}
          >
            Specific People
          </button>
          <button
            type="button"
            className={`${styles.segment} ${visibilityMode === 'private' ? styles['segment-active'] : ''}`}
            onClick={() => onVisibilityModeChange('private')}
            disabled={disabled}
            aria-pressed={visibilityMode === 'private'}
          >
            Only Me
          </button>
        </div>

        {visibilityMode === 'restricted' && hasShares && (
          <div className={styles['specific-panel']}>
            {showSearch && (
              <input
                type="search"
                className={styles['search-input']}
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search list members"
                disabled={disabled}
              />
            )}
            <div className={styles['user-list']} role="group" aria-label="Select people">
              {filteredShares.length === 0 ? (
                <p className={styles['empty-state']}>No matching people found.</p>
              ) : (
                filteredShares.map((share) => (
                  <div
                    key={share.UserId}
                    className={styles['collaborator-row']}
                    onClick={() => !disabled && onToggleUser(share.UserId)}
                    role="checkbox"
                    aria-checked={selectedUserIds.includes(share.UserId)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        if (!disabled) onToggleUser(share.UserId);
                      }
                    }}
                  >
                    <div className={styles['collaborator-info']}>
                      <UserPreviewCard userId={share.UserId} displayName={getDisplayName(share)}>
                        <span className={styles.avatar} aria-hidden="true" style={{ cursor: 'pointer' }}>
                          {getInitials(share)}
                        </span>
                      </UserPreviewCard>
                      <div className={styles['name-stack']}>
                        <span className={styles['user-name']}>{getDisplayName(share)}</span>
                        {share.Username && (share.FirstName || share.LastName) && (
                          <span className={styles['user-handle']}>@{share.Username}</span>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={selectedUserIds.includes(share.UserId)}
                      onChange={() => {}}
                      disabled={disabled}
                      size="sm"
                      className={styles['row-toggle']}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
