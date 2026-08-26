import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
  Calendar,
  Users,
  Download,
  Upload,
  MessageSquare,
  Share2,
  Settings,
  BookCopy,
} from 'lucide-react';
import { EnterPanel } from 'shared/ui';
import { OwnerBadge } from 'features/items/components/item-presentation';
import { exportToCsv, exportToXlsx, exportToTxt, exportToJson, exportToPdf } from 'shared/utils/wishlist-export';
import { ListSettingsPanel } from '../list-settings-panel/list-settings-panel.component';
import { HeaderTemplateProps } from './interfaces/header-template-props.interface';
import styles from '../../wishlist-detail.module.css';
import { expiresAtIsoToDateInput } from 'features/wishlists/utils/expires-at-iso-to-date-input.util';

export const HeaderTemplate: React.FC<HeaderTemplateProps> = ({
  wishlist,
  isOwner,
  isPublicGuest = false,
  isExpired,
  isArchived,
  isDeactivating,
  isActivating,
  isDeleting,
  confirmAction,
  setConfirmAction,
  handleDeactivateConfirm,
  handleActivateConfirm,
  handleDeleteConfirm,
  saveTitle,
  saveDate,
  formatDate,
  toggleAiEnabled,
  toggleWebSearchEnabled,
  toggleManualJobBackground,
  toggleAutoRollover,
  canShowAi,
  canShowWebSearch,
  isCommentsOpen,
  setIsCommentsOpen,
  setIsShareOpen,
  canImport,
  isImportOpen,
  onImportToggle,
  onDuplicate,
  isDuplicating,
  isEditingTitle,
  setIsEditingTitle,
  tempTitle,
  setTempTitle,
  isEditingDate,
  setIsEditingDate,
  tempDate,
  setTempDate,
  isExportDropdownOpen,
  setIsExportDropdownOpen,
  exportRef,
  isListSettingsOpen,
  setIsListSettingsOpen,
  listSettingsRef,
  exportContext,
  showListSettings,
  listSettingsReadOnly,
  showOwnerBadgeRegion,
  hideOwnerBadgeOnMobile = false,
}) => {
  return (
    <>
      {confirmAction && (
        <EnterPanel
          animation="slide-down"
          className={`${styles['confirm-banner']}${confirmAction === 'activate' || confirmAction === 'deactivate' ? ` ${styles['confirm-banner--warning']}` : ''}${confirmAction === 'duplicate' ? ` ${styles['confirm-banner--primary']}` : ''}`}
        >
          <span className={styles['confirm-text']}>
            {confirmAction === 'deactivate'
              ? 'Are you sure you want to deactivate and archive this wishlist?'
              : confirmAction === 'activate'
                ? 'Are you sure you want to restore this wishlist from the archive?'
                : confirmAction === 'duplicate'
                  ? 'Duplicate this list for yourself?'
                  : 'Are you sure you want to permanently delete this wishlist and all of its items?'}
          </span>
          <div className={styles['confirm-buttons']}>
            <button
              onClick={
                confirmAction === 'deactivate'
                  ? handleDeactivateConfirm
                  : confirmAction === 'activate'
                    ? handleActivateConfirm
                    : confirmAction === 'duplicate'
                      ? onDuplicate
                      : handleDeleteConfirm
              }
              className={`${styles['confirm-btn']} ${styles['yes-btn']}${confirmAction === 'activate' || confirmAction === 'deactivate' ? ` ${styles['yes-btn--warning']}` : ''}${confirmAction === 'duplicate' ? ` ${styles['yes-btn--primary']}` : ''}`}
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
        </EnterPanel>
      )}

      <div className={styles['top-row']}>
        {isPublicGuest ? (
          <Link to="/login" className={styles['back-link']}>
            <ArrowLeft size={14} aria-hidden /> Log in
          </Link>
        ) : (
          <Link to="/dashboard" className={styles['back-link']}>
            <ArrowLeft size={14} aria-hidden /> Back to Dashboard
          </Link>
        )}
      </div>

      <div className={styles.header}>
        <div className={styles['header-main']}>
          <div className={styles['title-row']}>
            {isEditingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => {
                  saveTitle(tempTitle);
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveTitle(tempTitle);
                    setIsEditingTitle(false);
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
                    type="button"
                    onClick={() => setIsEditingTitle(true)}
                    className={styles['edit-title-btn']}
                    title="Rename wishlist"
                    aria-label="Rename wishlist"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </h1>
            )}
          </div>
          <div className={`${styles['meta-row']} ${styles['meta-chips']}`}>
            {isEditingDate ? (
              <input
                type="date"
                value={tempDate}
                onChange={(e) => saveDate(e.target.value)}
                onBlur={() => setIsEditingDate(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setTempDate(expiresAtIsoToDateInput(wishlist.ExpiresAt));
                    setIsEditingDate(false);
                  }
                }}
                autoFocus
                className={styles['inline-date-input']}
              />
            ) : isOwner ? (
              <button
                type="button"
                className={`${styles['calendar-btn']} ${styles.chip} ${styles['chip-primary']}`}
                onClick={() => setIsEditingDate(true)}
                title="Change expiration date"
              >
                <Calendar size={14} aria-hidden />
                <span>{formatDate(wishlist.ExpiresAt)}</span>
                {isExpired && <span className={styles['expired-label']}>(Expired)</span>}
              </button>
            ) : (
              <div className={`${styles['meta-item']} ${styles.chip} ${styles['chip-primary']}`}>
                <Calendar size={14} aria-hidden />
                <span>{formatDate(wishlist.ExpiresAt)}</span>
                {isExpired && <span className={styles['expired-label']}>(Expired)</span>}
              </div>
            )}
            {wishlist.AllowGroupFunds && (
              <div className={`${styles['meta-item']} ${styles.chip}`}>
                <Users size={14} aria-hidden />
                <span>Group Funding Enabled</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles['right-container']}>
          {isOwner && (
            <div className={styles['archive-actions']}>
              {isArchived ? (
                <>
                  <button
                    type="button"
                    className={styles['action-pill']}
                    onClick={() => setConfirmAction('activate')}
                    disabled={isDeactivating || isActivating || isDeleting}
                    title="Restore Wishlist from Archive"
                    aria-label="Restore Wishlist from Archive"
                  >
                    <ArchiveRestore size={16} aria-hidden />
                    <span className={styles['action-pill-label']}>Restore</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles['action-pill']} ${styles['action-pill-danger']}`}
                    onClick={() => setConfirmAction('delete')}
                    disabled={isDeactivating || isActivating || isDeleting}
                    title="Delete Wishlist and Items"
                    aria-label="Delete Wishlist and Items"
                  >
                    <Trash2 size={16} aria-hidden />
                    <span className={styles['action-pill-label']}>Delete</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`${styles['action-pill']} ${styles['action-pill-warning']}`}
                  onClick={() => setConfirmAction('deactivate')}
                  disabled={isDeactivating || isActivating || isDeleting}
                  title="Deactivate / Archive Wishlist"
                  aria-label="Deactivate / Archive Wishlist"
                >
                  <Archive size={16} aria-hidden />
                  <span className={styles['action-pill-label']}>Archive</span>
                </button>
              )}
            </div>
          )}
          {!isPublicGuest && (
          <div className={`${styles.actions} ${styles['mobile-action-bar']}`}>
            <div className={styles.headerToolbarActions}>
              {isOwner && (
                <button
                  type="button"
                  className={`${styles['action-pill']} ${styles.mobileSharePill}`}
                  onClick={() => setIsShareOpen(true)}
                  title="Share Registry"
                  aria-label="Share Registry"
                >
                  <Share2 size={16} aria-hidden />
                  <span className={styles['action-pill-label']}>Share</span>
                </button>
              )}
              {!isPublicGuest && (
                <button
                  type="button"
                  className={styles['action-pill']}
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  title="Discussion"
                  aria-label="Discussion"
                  aria-pressed={isCommentsOpen}
                >
                  <MessageSquare size={16} aria-hidden />
                  <span className={styles['action-pill-label']}>Discuss</span>
                </button>
              )}
              {showListSettings && (
                <div className={styles['export-dropdown-container']} ref={listSettingsRef}>
                  <button
                    type="button"
                    className={`${styles['action-pill']}${listSettingsReadOnly ? ` ${styles['action-pill-muted']}` : ''}`}
                    onClick={() => setIsListSettingsOpen(!isListSettingsOpen)}
                    title="List settings"
                    aria-label="List settings"
                    aria-expanded={isListSettingsOpen}
                    aria-pressed={isListSettingsOpen}
                  >
                    <Settings size={16} aria-hidden />
                    <span className={styles['action-pill-label']}>Settings</span>
                  </button>
                  {isListSettingsOpen && (
                    <EnterPanel
                      animation="dropdown"
                      className={styles['list-settings-dropdown-menu']}
                      role="dialog"
                      aria-label="List feature settings"
                    >
                      <ListSettingsPanel
                        aiEnabled={!!wishlist.AiEnabled}
                        webSearchEnabled={!!wishlist.WebSearchEnabled}
                        manualJobBackground={wishlist.ManualJobBackground !== false}
                        autoRollover={wishlist.AutoRollover === true}
                        canShowAi={canShowAi}
                        canShowWebSearch={canShowWebSearch}
                        readOnly={listSettingsReadOnly}
                        onToggleAi={toggleAiEnabled}
                        onToggleWebSearch={toggleWebSearchEnabled}
                        onToggleManualJobBackground={toggleManualJobBackground}
                        onToggleAutoRollover={toggleAutoRollover}
                      />
                    </EnterPanel>
                  )}
                </div>
              )}
              {wishlist && !isPublicGuest && (
                <button
                  type="button"
                  className={styles['action-pill']}
                  onClick={() => setConfirmAction('duplicate')}
                  disabled={isDuplicating}
                  aria-label="Duplicate wishlist"
                >
                  <BookCopy size={16} aria-hidden />
                  <span className={styles['action-pill-label']}>
                    {isDuplicating ? 'Duplicating…' : 'Duplicate'}
                  </span>
                </button>
              )}
              {canImport && (
                <button
                  type="button"
                  className={`${styles['action-pill']} ${wishlist.AiEnabled ? styles['action-pill-ai'] : ''}`}
                  onClick={onImportToggle}
                  aria-label="Import wishlist"
                  aria-pressed={isImportOpen}
                >
                  <Upload size={16} aria-hidden />
                  <span className={styles['action-pill-label']}>Import</span>
                </button>
              )}
              {wishlist && !isPublicGuest && (
                <div className={styles['export-dropdown-container']} ref={exportRef} title="Export">
                  <button
                    type="button"
                    className={styles['action-pill']}
                    onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                    aria-label="Export"
                    aria-expanded={isExportDropdownOpen}
                  >
                    <Download size={16} aria-hidden />
                    <span className={styles['action-pill-label']}>Export</span>
                  </button>
                  {isExportDropdownOpen && (
                    <EnterPanel animation="dropdown" className={styles['export-dropdown-menu']}>
                      <button
                        type="button"
                        className={styles['export-dropdown-item']}
                        onClick={() => {
                          exportToCsv(wishlist.Id, wishlist.Title, exportContext);
                          setIsExportDropdownOpen(false);
                        }}
                      >
                        CSV
                      </button>
                      <button
                        type="button"
                        className={styles['export-dropdown-item']}
                        onClick={() => {
                          exportToXlsx(wishlist.Id, wishlist.Title, exportContext);
                          setIsExportDropdownOpen(false);
                        }}
                      >
                        XLSX
                      </button>
                      <button
                        type="button"
                        className={styles['export-dropdown-item']}
                        onClick={() => {
                          exportToTxt(wishlist.Id, wishlist.Title, exportContext);
                          setIsExportDropdownOpen(false);
                        }}
                      >
                        TXT
                      </button>
                      <button
                        type="button"
                        className={styles['export-dropdown-item']}
                        onClick={() => {
                          exportToJson(wishlist.Id, wishlist.Title, exportContext);
                          setIsExportDropdownOpen(false);
                        }}
                      >
                        JSON
                      </button>
                      <button
                        type="button"
                        className={styles['export-dropdown-item']}
                        onClick={() => {
                          exportToPdf(wishlist.Id, wishlist.Title, exportContext);
                          setIsExportDropdownOpen(false);
                        }}
                      >
                        PDF
                      </button>
                    </EnterPanel>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {showOwnerBadgeRegion && (
            <div
              className={[
                styles['owner-badge-container'],
                hideOwnerBadgeOnMobile ? styles.hideOwnerBadgeOnMobile : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.mobileOwnerBadge}>
                <OwnerBadge
                  userId={wishlist.UserId}
                  displayName={
                    wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner'
                  }
                  username={wishlist.OwnerUsername}
                  firstName={wishlist.OwnerFirstName}
                  avatar={wishlist.OwnerAvatar}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
