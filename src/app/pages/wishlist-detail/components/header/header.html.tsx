import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, Trash2, Edit2, Calendar, Users, Eye, EyeOff, Download, Upload, MessageSquare, Share2, Search } from 'lucide-react';
import { Button, EnterPanel, AiStatusBadge, Badge } from 'shared/ui';
import { OwnerBadge } from 'features/items/components/item-presentation';
import { exportToCsv, exportToXlsx, exportToTxt, exportToJson, exportToPdf } from 'shared/utils/wishlist-export';
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
  toggleWebSearchEnabled,
  canShowAi,
  canShowWebSearch,
  isCommentsOpen,
  setIsCommentsOpen,
  setIsShareOpen,
  canImport,
  isImportOpen,
  onImportToggle,
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
          </div>
        </div>

        <div className={styles['right-container']}>
          <div className={styles.actions}>
            <div className={styles.headerToolbarActions}>
            {wishlist && canImport && (
              <Button
                variant="secondary"
                className={styles['export-dropdown-trigger']}
                onClick={onImportToggle}
                aria-label="Import wishlist"
                aria-pressed={isImportOpen}
                effect={wishlist.AiEnabled ? 'rainbow' : 'none'}
              >
                <Upload size={16} />
              </Button>
            )}
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
                          wishlist.Id,
                          wishlist.Title,
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
                          wishlist.Id,
                          wishlist.Title,
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
                          wishlist.Id,
                          wishlist.Title,
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
                          wishlist.Id,
                          wishlist.Title,
                          exportContext
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      JSON
                    </button>
                    <button
                      className={styles['export-dropdown-item']}
                      onClick={() => {
                        exportToPdf(
                          wishlist.Id,
                          wishlist.Title,
                          exportContext
                        );
                        setIsExportDropdownOpen(false);
                      }}
                    >
                      PDF
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
          {((canShowAi && (isOwner || wishlist.AiEnabled)) ||
            (canShowWebSearch && (isOwner || wishlist.WebSearchEnabled)) ||
            !isOwner) && (
            <div className={styles['owner-badge-container']}>
              <div className={styles.desktopListFeatureBadges}>
                {canShowAi && (
                  isOwner ? (
                    <AiStatusBadge
                      enabled={!!wishlist.AiEnabled}
                      onToggle={toggleAiEnabled}
                      ariaLabelEnabled="AI reviews enabled for this list. Click to disable."
                      ariaLabelDisabled="AI reviews disabled for this list. Click to enable."
                    />
                  ) : (
                    wishlist.AiEnabled && (
                      <AiStatusBadge
                        enabled
                        ariaLabelEnabled="AI reviews active on this list"
                        ariaLabelDisabled="AI reviews inactive on this list"
                      />
                    )
                  )
                )}
                {canShowWebSearch && (
                  isOwner ? (
                    <Badge
                      size="md"
                      icon={<Search size={16} />}
                      active={!!wishlist.WebSearchEnabled}
                      onClick={toggleWebSearchEnabled}
                      ariaPressed={!!wishlist.WebSearchEnabled}
                      ariaLabel={
                        wishlist.WebSearchEnabled
                          ? 'Web search enabled for this list. Click to disable.'
                          : 'Web search disabled for this list. Click to enable.'
                      }
                    >
                      Web Search {wishlist.WebSearchEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  ) : (
                    wishlist.WebSearchEnabled && (
                      <Badge
                        size="md"
                        icon={<Search size={16} />}
                        active
                        ariaLabel="Web search active on this list"
                      >
                        Web Search Enabled
                      </Badge>
                    )
                  )
                )}
              </div>
              {!isOwner && (
                <div className={styles.mobileOwnerBadge}>
                  <OwnerBadge
                    userId={wishlist.UserId}
                    displayName={wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner'}
                    username={wishlist.OwnerUsername}
                    firstName={wishlist.OwnerFirstName}
                    avatar={wishlist.OwnerAvatar}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
