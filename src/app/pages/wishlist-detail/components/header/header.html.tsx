import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, Trash2, Edit2, Calendar, Users, Eye, EyeOff, Download, MessageSquare, Share2 } from 'lucide-react';
import { Button, EnterPanel, AiStatusBadge } from 'shared/ui';
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
  toggleAiEnabled,
  canShowAi,
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
  exportContext,
}) => {
  return (
    <>
      {confirmAction && (
        <EnterPanel animation="slide-down" className={styles['confirm-banner']}>
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
        </EnterPanel>
      )}

      {/* Navigation Breadcrumb & Deactivate/Delete Action */}
      <div className={styles['top-row']}>
        <Link to="/dashboard" className={styles['back-link']}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        {isOwner && (
          <div className={styles['top-actions']}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmAction('deactivate')}
              disabled={isDeactivating || isDeleting}
              title="Deactivate / Archive Wishlist"
              aria-label="Deactivate / Archive Wishlist"
            >
              <Archive size={16} />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setConfirmAction('delete')}
              disabled={isDeactivating || isDeleting}
              title="Delete Wishlist and Items"
              aria-label="Delete Wishlist and Items"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Main Details Banner */}
      <div className={styles.header}>
        <div>
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
          <div className={styles['meta-row']}>
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
                {isExpired && <span className={styles['expired-label']}>(Expired)</span>}
              </button>
            ) : (
              <div className={styles['meta-item']}>
                <Calendar size={14} />
                <span>{formatDate(wishlist.ExpiresAt)}</span>
                {isExpired && <span className={styles['expired-label']}>(Expired)</span>}
              </div>
            )}
            {wishlist.AllowGroupFunds && (
              <div className={styles['meta-item']}>
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
            {canShowAi && isOwner && (
              <AiStatusBadge
                enabled={!!wishlist.AiEnabled}
                onToggle={toggleAiEnabled}
                ariaLabelEnabled="AI reviews enabled for this list. Click to disable."
                ariaLabelDisabled="AI reviews disabled for this list. Click to enable."
              />
            )}
            {canShowAi && !isOwner && wishlist.AiEnabled && (
              <AiStatusBadge
                enabled
                ariaLabelEnabled="AI reviews active on this list"
                ariaLabelDisabled="AI reviews inactive on this list"
              />
            )}
            {!isOwner && (
              <div className={styles['meta-item']}>
                <Eye size={14} />
                <span>Owner: {wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner'}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          {wishlist && (
            <div className={styles['export-dropdown-container']} ref={exportRef} title="Export">
              <Button
                variant="secondary"
                className={styles['export-dropdown-trigger']}
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                aria-label="Export"
              >
                <Download size={16} />
              </Button>
              {isExportDropdownOpen && (
                <EnterPanel animation="dropdown" className={styles['export-dropdown-menu']}>
                  <button
                    className={styles['export-dropdown-item']}
                    onClick={() => {
                      exportToCsv(
                        wishlist.Title,
                        items,
                        priorities,
                        exportContext
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    CSV
                  </button>
                  <button
                    className={styles['export-dropdown-item']}
                    onClick={() => {
                      exportToXlsx(
                        wishlist.Title,
                        items,
                        priorities,
                        exportContext
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    XLSX
                  </button>
                  <button
                    className={styles['export-dropdown-item']}
                    onClick={() => {
                      exportToTxt(
                        wishlist.Title,
                        items,
                        priorities,
                        exportContext
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    TXT
                  </button>
                  <button
                    className={styles['export-dropdown-item']}
                    onClick={() => {
                      exportToJson(
                        wishlist.Title,
                        items,
                        priorities,
                        exportContext
                      );
                      setIsExportDropdownOpen(false);
                    }}
                  >
                    JSON
                  </button>
                </EnterPanel>
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
