import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, Trash2, Edit2, Calendar, Users, Eye, EyeOff, Download, MessageSquare, Share2 } from 'lucide-react';
import { Button } from 'shared/ui';
import { exportToCsv, exportToXlsx, exportToTxt, exportToJson } from 'shared/utils/wishlist-export';
import { HeaderTemplateProps } from './interfaces/header-template-props.interface';
import styles from '../../wishlist-detail.module.css';

export const HeaderTemplate: React.FC<HeaderTemplateProps> = ({
  wishlist,
  items,
  priorities,
  isOwner,
  isExpired,
  isDeactivating,
  isDeleting,
  confirmAction,
  setConfirmAction,
  handleDeactivateConfirm,
  handleDeleteConfirm,
  saveTitle,
  saveDate,
  formatDate,
  toggleRevealSuggestions,
  isCommentsOpen,
  setIsCommentsOpen,
  setIsShareOpen,
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
}) => {
  return (
    <>
      {confirmAction && (
        <div className={styles['confirm-banner']}>
          <span className={styles['confirm-text']}>
            {confirmAction === 'deactivate'
              ? 'Are you sure you want to deactivate and archive this wishlist?'
              : 'Are you sure you want to permanently delete this wishlist and all of its items?'}
          </span>
          <div className={styles['confirm-buttons']}>
            <button
              onClick={confirmAction === 'deactivate' ? handleDeactivateConfirm : handleDeleteConfirm}
              className={`${styles['confirm-btn']} ${styles['yes-btn']}`}
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
        </div>
      )}

      {/* Navigation Breadcrumb & Deactivate/Delete Action */}
      <div className={styles['top-row']}>
        <Link to="/dashboard" className={styles.backLink}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        {isOwner && (
          <div className={styles['top-actions']}>
            <button
              onClick={() => setConfirmAction('deactivate')}
              disabled={isDeactivating || isDeleting}
              className={styles['archive-btn']}
              title="Deactivate / Archive Wishlist"
            >
              <Archive size={16} />
            </button>
            <button
              onClick={() => setConfirmAction('delete')}
              disabled={isDeactivating || isDeleting}
              className={styles['deactivate-trash-btn']}
              title="Delete Wishlist and Items"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Main Details Banner */}
      <div className={styles.header}>
        <div className={styles.headerMeta}>
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
                  onClick={() => setIsEditingTitle(true)}
                  className={styles['edit-title-btn']}
                  title="Rename wishlist"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </h1>
          )}
          <div className={styles.metaRow}>
            {isEditingDate ? (
              <input
                type="date"
                value={tempDate}
                onChange={(e) => saveDate(e.target.value)}
                onBlur={() => setIsEditingDate(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
                    setTempDate(prevDateStr);
                    setIsEditingDate(false);
                  }
                }}
                autoFocus
                className={styles['inline-date-input']}
              />
            ) : isOwner ? (
              <button
                className={styles['calendar-btn']}
                onClick={() => setIsEditingDate(true)}
                title="Change expiration date"
              >
                <Calendar size={14} />
                <span>{formatDate(wishlist.ExpiresAt)}</span>
                {isExpired && <span className={styles.expiredLabel}>(Expired)</span>}
              </button>
            ) : (
              <div className={styles.metaItem}>
                <Calendar size={14} />
                <span>{formatDate(wishlist.ExpiresAt)}</span>
                {isExpired && <span className={styles.expiredLabel}>(Expired)</span>}
              </div>
            )}
            {wishlist.AllowGroupFunds && (
              <div className={styles.metaItem}>
                <Users size={14} />
                <span>Group Funding Enabled</span>
              </div>
            )}
            {isOwner && (
              <button
                className={styles['settings-btn']}
                onClick={toggleRevealSuggestions}
                title="Toggle suggestion visibility after list expiration"
              >
                {wishlist.RevealSuggestions ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{wishlist.RevealSuggestions ? 'Reveal suggestions after expiration' : 'Hide suggestions permanently'}</span>
              </button>
            )}
            {!isOwner && (
              <div className={styles.metaItem}>
                <Eye size={14} />
                <span>Owner: {wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner'}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {wishlist && (
            <div className={styles.exportDropdownContainer} ref={exportRef} title="Export">
              <Button
                variant="secondary"
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                aria-label="Export"
              >
                <Download size={16} />
              </Button>
              {isExportDropdownOpen && (
                <div className={styles.exportDropdownMenu}>
                  <button
                    className={styles.exportDropdownItem}
                    onClick={() => {
                      exportToCsv(
                        wishlist.Title,
                        items,
                        priorities,
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    CSV
                  </button>
                  <button
                    className={styles.exportDropdownItem}
                    onClick={() => {
                      exportToXlsx(
                        wishlist.Title,
                        items,
                        priorities,
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    XLSX
                  </button>
                  <button
                    className={styles.exportDropdownItem}
                    onClick={() => {
                      exportToTxt(
                        wishlist.Title,
                        items,
                        priorities,
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    TXT
                  </button>
                  <button
                    className={styles.exportDropdownItem}
                    onClick={() => {
                      exportToJson(
                        wishlist.Title,
                        items,
                        priorities,
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    JSON
                  </button>
                </div>
              )}
            </div>
          )}
          <Button
            variant="secondary"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            title="Discussion"
            aria-label="Discussion"
          >
            <MessageSquare size={16} />
          </Button>
          {isOwner && (
            <Button
              variant="secondary"
              onClick={() => setIsShareOpen(true)}
              title="Share Registry"
              aria-label="Share Registry"
            >
              <Share2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
