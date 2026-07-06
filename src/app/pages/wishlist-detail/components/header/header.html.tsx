import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, Trash2, Edit2, Calendar, Users, Eye, EyeOff, Download, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
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
  saveVisibility,
  globalAiEnabled,
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
              <div className={styles['visibility-group']}>
                <Eye size={14} />
                <select
                  value={wishlist.Visibility || 'private'}
                  onChange={(e) => saveVisibility(e.target.value as 'private' | 'friends' | 'link')}
                  className={styles['visibility-select']}
                  title="Wishlist visibility"
                >
                  <option value="private">Private</option>
                  <option value="friends">Friends</option>
                  <option value="link">Link</option>
                </select>
              </div>
            )}
            {!isOwner && wishlist.Visibility && wishlist.Visibility !== 'private' && (
              <div className={styles['meta-item']}>
                <Eye size={14} />
                <span>{wishlist.Visibility === 'friends' ? 'Friends Only' : 'Link Access'}</span>
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
            {globalAiEnabled && isOwner && (
              <button
                className={styles['settings-btn']}
                onClick={toggleAiEnabled}
                title="Toggle AI-powered item reviews"
              >
                <Sparkles size={14} style={{ color: wishlist.AiEnabled ? 'var(--primary)' : 'inherit' }} />
                <span>{wishlist.AiEnabled ? 'AI Reviews Enabled' : 'AI Reviews Disabled'}</span>
              </button>
            )}
            {globalAiEnabled && !isOwner && wishlist.AiEnabled && (
              <div className={styles['meta-item']}>
                <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                <span>AI Reviews Active</span>
              </div>
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
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
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
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
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
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
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
                        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Owner'
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
