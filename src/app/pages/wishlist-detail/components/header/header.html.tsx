import React from 'react';
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit2,
  Calendar,
  Download,
  Upload,
  MessageSquare,
  Share2,
  Settings,
  BookCopy,
} from 'lucide-react';
import { EnterPanel, DateField } from 'shared/ui';
import { OwnerBadge } from 'features/items/components/item-presentation';
import { TOUR_TARGETS } from 'features/tour';
import { SettingsPanel } from '../settings-panel/settings-panel.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './header.module.css';

export const HeaderTemplate: React.FC<TemplateProps> = ({
  wishlist,
  isOwner,
  isPublicGuest = false,
  onGoHome,
  isExpired,
  isArchived,
  confirmAction,
  confirmMessage,
  confirmBannerClassName,
  confirmYesBtnClassName,
  onConfirmYes,
  onConfirmNo,
  formatDate,
  toggleAiEnabled,
  toggleWebSearchEnabled,
  toggleManualJobBackground,
  toggleAutoRollover,
  toggleAllowGroupFunds,
  canShowAi,
  canShowWebSearch,
  isCommentsOpen,
  canImport,
  isImportOpen,
  onImportToggle,
  isDuplicating,
  duplicateLabel,
  isEditingTitle,
  tempTitle,
  onTitleChange,
  onTitleBlur,
  onTitleKeyDown,
  onStartEditTitle,
  isEditingDate,
  tempDate,
  onDateChange,
  onStartEditDate,
  isExportDropdownOpen,
  exportRef,
  isListSettingsOpen,
  listSettingsRef,
  showListSettings,
  listSettingsReadOnly,
  listSettingsPillClassName,
  showOwnerBadgeRegion,
  ownerBadgeClassName,
  ownerDisplayName,
  backLinkLabel,
  actionsBusy,
  importPillClassName,
  onOpenShare,
  onToggleComments,
  onToggleListSettings,
  onToggleExport,
  onRequestActivate,
  onRequestDeactivate,
  onRequestDelete,
  onRequestDuplicate,
  onExportCsv,
  onExportXlsx,
  onExportTxt,
  onExportJson,
  onExportPdf,
}) => (
  <>
    {confirmAction ? (
      <EnterPanel
        animation = {
          'slide-down'
        }
        className = {
          confirmBannerClassName
        }
      >
        <span className={styles['header__confirm-text']}>{confirmMessage}</span>
        <div className={styles['header__confirm-buttons']}>
          <button type="button" onClick={onConfirmYes} className={confirmYesBtnClassName}>
            Yes
          </button>
          <button
            type = {
              'button'
            }
            onClick = {
              onConfirmNo
            }
            className = {
              `${styles['header__confirm-btn']} ${styles['header__no-btn']}`
            }
          >
            No
          </button>
        </div>
      </EnterPanel>
    ) : null}

    <div className={styles['header__top-row']}>
      <button type="button" className={styles['header__back-link']} onClick={onGoHome}>
        <ArrowLeft
          size = {
            14
          }
          aria-hidden
        />
        {backLinkLabel}
      </button>
    </div>

    <div className={styles.header}>
      <div className={styles['header__main']}>
        <div className={styles['header__title-row']}>
          {isEditingTitle ? (
            <input
              type = {
                'text'
              }
              value = {
                tempTitle
              }
              onChange = {
                (e) => onTitleChange(e.target.value)
              }
              onBlur = {
                onTitleBlur
              }
              onKeyDown = {
                onTitleKeyDown
              }
              autoFocus
              className = {
                styles['header__inline-title-input']
              }
            />
          ) : (
            <h1 className={styles['header__title']}>
              {wishlist.Title}
              {isOwner ? (
                <button
                  type="button"
                  onClick={onStartEditTitle}
                  className={styles['header__edit-title-btn']}
                  title="Rename wishlist"
                  aria-label="Rename wishlist"
                >
                  <Edit2
                    size = {
                      16
                    }
                  />
                </button>
              ) : null}
            </h1>
          )}
        </div>
        <div className={`${styles['header__meta-row']} ${styles['header__meta-chips']}`}>
          {isEditingDate ? (
            <DateField
              value = {
                tempDate
              }
              onChange = {
                onDateChange
              }
              clearable
              aria-label = {
                'Change expiration date'
              }
              className = {
                styles['header__inline-date-field']
              }
            />
          ) : isOwner ? (
            <button
              type = {
                'button'
              }
              className = {
                `${styles['header__calendar-btn']} ${styles['header__chip']} ${styles['header__chip--primary']}`
              }
              onClick = {
                onStartEditDate
              }
              title = {
                'Change expiration date'
              }
            >
              <Calendar
                size = {
                  14
                }
                aria-hidden
              />
              <span>{formatDate(wishlist.ExpiresAt)}</span>
              {isExpired ? <span className={styles['header__expired-label']}>(Expired)</span> : null}
            </button>
          ) : (
            <div
              className = {
                `${styles['header__meta-item']} ${styles['header__chip']} ${styles['header__chip--primary']}`
              }
            >
              <Calendar
                size = {
                  14
                }
                aria-hidden
              />
              <span>{formatDate(wishlist.ExpiresAt)}</span>
              {isExpired ? <span className={styles['header__expired-label']}>(Expired)</span> : null}
            </div>
          )}
        </div>
      </div>

      <div className={styles['header__right']}>
        {isOwner ? (
          <div className={styles['header__archive-actions']}>
            {isArchived ? (
              <>
                <button
                  type="button"
                  className={styles['header__action-pill']}
                  onClick={onRequestActivate}
                  disabled={actionsBusy}
                  title="Restore Wishlist from Archive"
                  aria-label="Restore Wishlist from Archive"
                >
                  <ArchiveRestore
                    size = {
                      16
                    }
                    aria-hidden
                  />
                  <span className={styles['header__action-pill-label']}>Restore</span>
                </button>
                <button
                  type="button"
                  className={`${styles['header__action-pill']} ${styles['header__action-pill--danger']}`}
                  onClick={onRequestDelete}
                  disabled={actionsBusy}
                  title="Delete Wishlist and Items"
                  aria-label="Delete Wishlist and Items"
                >
                  <Trash2
                    size = {
                      16
                    }
                    aria-hidden
                  />
                  <span className={styles['header__action-pill-label']}>Delete</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`${styles['header__action-pill']} ${styles['header__action-pill--warning']}`}
                onClick={onRequestDeactivate}
                disabled={actionsBusy}
                title="Deactivate / Archive Wishlist"
                aria-label="Deactivate / Archive Wishlist"
              >
                <Archive
                  size = {
                    16
                  }
                  aria-hidden
                />
                <span className={styles['header__action-pill-label']}>Archive</span>
              </button>
            )}
          </div>
        ) : null}

        {!isPublicGuest ? (
          <div className={`${styles['header__actions']} ${styles['header__mobile-action-bar']}`}>
            <div className={styles['header__toolbar-actions']}>
              {isOwner ? (
                <button
                  type="button"
                  className={`${styles['header__action-pill']} ${styles['header__action-pill--mobile-share']}`}
                  onClick={onOpenShare}
                  title="Share Registry"
                  aria-label="Share Registry"
                  data-tour={TOUR_TARGETS.shareRegistry}
                >
                  <Share2
                    size = {
                      16
                    }
                    aria-hidden
                  />
                  <span className={styles['header__action-pill-label']}>Share</span>
                </button>
              ) : null}

              <button
                type="button"
                className={styles['header__action-pill']}
                onClick={onToggleComments}
                title="Discussion"
                aria-label="Discussion"
                aria-pressed={isCommentsOpen}
                data-tour={TOUR_TARGETS.discussion}
              >
                <MessageSquare
                  size = {
                    16
                  }
                  aria-hidden
                />
                <span className={styles['header__action-pill-label']}>Discuss</span>
              </button>

              {showListSettings ? (
                <div className={styles['header__export-dropdown']} ref={listSettingsRef}>
                  <button
                    type="button"
                    className={listSettingsPillClassName}
                    onClick={onToggleListSettings}
                    title="List settings"
                    aria-label="List settings"
                    aria-expanded={isListSettingsOpen}
                    aria-pressed={isListSettingsOpen}
                    data-tour={TOUR_TARGETS.listSettings}
                  >
                    <Settings
                      size = {
                        16
                      }
                      aria-hidden
                    />
                    <span className={styles['header__action-pill-label']}>Settings</span>
                  </button>
                  {isListSettingsOpen ? (
                    <EnterPanel
                      animation = {
                        'dropdown'
                      }
                      className = {
                        styles['header__list-settings-menu']
                      }
                      role = {
                        'dialog'
                      }
                      aria-label = {
                        'List feature settings'
                      }
                    >
                      <SettingsPanel
                        aiEnabled = {
                          !!wishlist.AiEnabled
                        }
                        webSearchEnabled = {
                          !!wishlist.WebSearchEnabled
                        }
                        manualJobBackground = {
                          wishlist.ManualJobBackground !== false
                        }
                        autoRollover = {
                          wishlist.AutoRollover === true
                        }
                        allowGroupFunds = {
                          wishlist.AllowGroupFunds === true
                        }
                        canShowAi = {
                          canShowAi
                        }
                        canShowWebSearch = {
                          canShowWebSearch
                        }
                        readOnly = {
                          listSettingsReadOnly
                        }
                        onToggleAi = {
                          toggleAiEnabled
                        }
                        onToggleWebSearch = {
                          toggleWebSearchEnabled
                        }
                        onToggleManualJobBackground = {
                          toggleManualJobBackground
                        }
                        onToggleAutoRollover = {
                          toggleAutoRollover
                        }
                        onToggleAllowGroupFunds = {
                          toggleAllowGroupFunds
                        }
                      />
                    </EnterPanel>
                  ) : null}
                </div>
              ) : null}

              <button
                type="button"
                className={styles['header__action-pill']}
                onClick={onRequestDuplicate}
                disabled={isDuplicating}
                aria-label="Duplicate wishlist"
              >
                <BookCopy
                  size = {
                    16
                  }
                  aria-hidden
                />
                <span className={styles['header__action-pill-label']}>{duplicateLabel}</span>
              </button>

              {canImport ? (
                <button
                  type="button"
                  className={importPillClassName}
                  onClick={onImportToggle}
                  aria-label="Import wishlist"
                  aria-pressed={isImportOpen}
                  data-tour={TOUR_TARGETS.importWishlist}
                >
                  <Upload
                    size = {
                      16
                    }
                    aria-hidden
                  />
                  <span className={styles['header__action-pill-label']}>Import</span>
                </button>
              ) : null}

              <div className={styles['header__export-dropdown']} ref={exportRef} title="Export">
                <button
                  type="button"
                  className={styles['header__action-pill']}
                  onClick={onToggleExport}
                  aria-label="Export"
                  aria-expanded={isExportDropdownOpen}
                >
                  <Download
                    size = {
                      16
                    }
                    aria-hidden
                  />
                  <span className={styles['header__action-pill-label']}>Export</span>
                </button>
                {isExportDropdownOpen ? (
                  <EnterPanel
                    animation = {
                      'dropdown'
                    }
                    className = {
                      styles['header__export-dropdown-menu']
                    }
                  >
                    <button
                      type="button"
                      className={styles['header__export-dropdown-item']}
                      onClick={onExportCsv}
                    >
                      CSV
                    </button>
                    <button
                      type="button"
                      className={styles['header__export-dropdown-item']}
                      onClick={onExportXlsx}
                    >
                      XLSX
                    </button>
                    <button
                      type="button"
                      className={styles['header__export-dropdown-item']}
                      onClick={onExportTxt}
                    >
                      TXT
                    </button>
                    <button
                      type="button"
                      className={styles['header__export-dropdown-item']}
                      onClick={onExportJson}
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      className={styles['header__export-dropdown-item']}
                      onClick={onExportPdf}
                    >
                      PDF
                    </button>
                  </EnterPanel>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {showOwnerBadgeRegion ? (
          <div className={ownerBadgeClassName}>
            <div className={styles['header__owner-badge-mobile']}>
              <OwnerBadge
                userId = {
                  wishlist.UserId
                }
                displayName = {
                  ownerDisplayName
                }
                username = {
                  wishlist.OwnerUsername
                }
                firstName = {
                  wishlist.OwnerFirstName
                }
                avatar = {
                  wishlist.OwnerAvatar
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  </>
);
