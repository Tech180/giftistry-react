import React from 'react';
import { AlertCircle, AlertTriangle, Check, Copy, Eye, EyeOff, Link2, Lock } from 'lucide-react';
import { QRCode } from 'react-qr-code';
import { Button, DateField, Input, SelectMenu, Switch } from 'shared/ui';
import {
  SHARE_ROLE_MENU_TITLE,
  SHARE_ROLE_OPTIONS,
} from 'features/wishlists/constants/share-role-options.constant';
import { formatDateTime } from 'shared/utils/format-date.util';
import {
  QR_ERROR_LEVEL,
  QR_SIZE_CLASSIC,
  QR_SIZE_COMPACT,
} from './constants/qr-size.constant';
import { TemplateProps } from './interfaces/template-props.interface';
import styles from './link.module.css';

export const LinkTabTemplate: React.FC<TemplateProps> = ({
  variant = 'classic',
  isOwner,
  isLoading,
  isGenerating,
  errorMsg,
  statusMsg,
  statusTone,
  activeInvite,
  shareUrl,
  shareUrlDisplay,
  linkEnabled,
  copied,
  role,
  setRole,
  hasExpiration,
  setHasExpiration,
  expDate,
  setExpDate,
  expTime,
  setExpTime,
  hasPassword,
  setHasPassword,
  password,
  setPassword,
  showPassword,
  onToggleShowPassword,
  handleGenerate,
  handleCopy,
  handleRevoke,
  handleSettings,
  handleToggleLink,
}) => {
  if (variant === 'compact') {
    if (!isOwner) {
      return <p className={styles.compactStatus}>Only the wishlist owner can manage share links.</p>;
    }

    if (isLoading) {
      return <p className={styles.compactStatus}>Checking link status...</p>;
    }

    return (
      <div className={styles.compactRoot}>
        {errorMsg && <p className={styles.compactAlert}>{errorMsg}</p>}

        <div className={styles.linkCard}>
          <div className={styles.linkHeader}>
            <div className={styles.linkInfo}>
              <div className={styles.linkIconWrap}>
                <Link2
                  size = {
                    16
                  }
                  aria-hidden
                />
              </div>
              <span className={styles.linkLabel}>
                {linkEnabled ? 'Link sharing on' : 'Link sharing off'}
              </span>
            </div>
            <Switch
              checked = {
                linkEnabled
              }
              onChange = {
                handleToggleLink
              }
              disabled = {
                isGenerating
              }
              aria-label = {
                linkEnabled ? 'Turn off link sharing' : 'Turn on link sharing'
              }
              size = {
                'sm'
              }
            />
          </div>

          {linkEnabled && shareUrl ? (
            <div className={styles.qr}>
              <div className={styles['qr__frame']}>
                <QRCode
                  value = {
                    shareUrl
                  }
                  size = {
                    QR_SIZE_COMPACT
                  }
                  level = {
                    QR_ERROR_LEVEL
                  }
                  bgColor = {
                    '#FFFFFF'
                  }
                  fgColor = {
                    '#000000'
                  }
                  className = {
                    styles['qr__image']
                  }
                  aria-label = {
                    'QR code for share link'
                  }
                />
              </div>
              <p className={styles['qr__hint']}>Scan to open this wishlist</p>
            </div>
          ) : null}

          {linkEnabled && shareUrl && (
            <div className={styles.linkUrlBox}>
              <span className={styles.linkUrlText}>{shareUrlDisplay}</span>
              <Button
                variant = {
                  'ghost'
                }
                size = {
                  'sm'
                }
                iconOnly
                className = {
                  styles.copyBtn
                }
                onClick = {
                  () => void handleCopy()
                }
                disabled = {
                  isGenerating
                }
                aria-label = {
                  copied ? 'Copied' : 'Copy link'
                }
                title = {
                  copied ? 'Copied' : 'Copy link'
                }
              >
                {copied ? (
                  <Check
                    size = {
                      16
                    }
                    aria-hidden
                  />
                ) : (
                  <Copy
                    size = {
                      16
                    }
                    aria-hidden
                  />
                )}
              </Button>
            </div>
          )}
        </div>

        <p className={styles.linkHelper}>
          Anyone with this link can view your wishlist and mark items as purchased.
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return <p className={styles['info-text']}>Only the wishlist owner can generate share links.</p>;
  }

  if (isLoading) {
    return <p className={styles['info-text']}>Checking link status...</p>;
  }

  return (
    <div className={styles['link-tab']}>
      {errorMsg && (
        <div className={`${styles.alert} ${styles['alert-error']}`}>
          <AlertCircle
            size = {
              16
            }
          />
          <span>{errorMsg}</span>
        </div>
      )}
      {statusMsg && (
        <div
          className = {
            [
              styles.alert,
              statusTone === 'warning' ? styles['alert-warning'] : styles['alert-success'],
            ].join(' ')
          }
          role = {
            'status'
          }
        >
          {statusTone === 'warning' ? (
            <AlertTriangle
              size = {
                16
              }
              className = {
                styles['alert-warning-icon']
              }
              aria-hidden
            />
          ) : (
            <Check
              size = {
                16
              }
            />
          )}
          <span>{statusMsg}</span>
        </div>
      )}

      {activeInvite ? (
        <div className={styles['setup-form']}>
          {shareUrl ? (
            <div className={styles.qr}>
              <div className={styles['qr__frame']}>
                <QRCode
                  value = {
                    shareUrl
                  }
                  size = {
                    QR_SIZE_CLASSIC
                  }
                  level = {
                    QR_ERROR_LEVEL
                  }
                  bgColor = {
                    '#FFFFFF'
                  }
                  fgColor = {
                    '#000000'
                  }
                  className = {
                    styles['qr__image']
                  }
                  aria-label = {
                    'QR code for share link'
                  }
                />
              </div>
              <p className={styles['qr__hint']}>Scan to open this wishlist</p>
            </div>
          ) : null}

          <div className={styles['active-link-box']}>
            <div className={styles['link-row']}>
              <div className={styles['user-details']} style={{ overflow: 'hidden' }}>
                <span className={`${styles['label']} ${styles['label--uppercase']}`}>Share Link</span>
                <span className={styles['link-text']}>
                  {shareUrl ||
                    'This link was created before URLs were stored. Use Link settings to generate a new one.'}
                </span>
              </div>
              {shareUrl && (
                <Button
                  variant = {
                    'ghost'
                  }
                  size = {
                    'sm'
                  }
                  iconOnly
                  onClick = {
                    handleCopy
                  }
                  aria-label = {
                    copied ? 'Copied' : 'Copy link'
                  }
                  title = {
                    copied ? 'Copied' : 'Copy link'
                  }
                >
                  {copied ? (
                    <Check
                      size = {
                        16
                      }
                    />
                  ) : (
                    <Copy
                      size = {
                        16
                      }
                    />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className={styles['info-grid']}>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Access</span>
              <span className={styles['info-value']}>{activeInvite.Role === 'viewer' ? 'Can view' : 'Can edit'}</span>
            </div>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Expires</span>
              <span className={styles['info-value']}>
                {formatDateTime(
                  activeInvite.ExpiresAt == null
                    ? null
                    : new Date(activeInvite.ExpiresAt).toISOString(),
                  'Never'
                )}
              </span>
            </div>
            {activeInvite.PasswordProtected && (
              <div className={styles['info-item']}>
                <span className={styles['info-label']}>Password</span>
                <span className={styles['info-value-success']}>
                  <Lock
                    size = {
                      12
                    }
                  /> Enabled
                </span>
              </div>
            )}
          </div>

          <div className={styles['actions-footer']}>
            <button type="button" className={styles['revoke-btn']} onClick={handleRevoke} disabled={isGenerating}>
              Revoke link
            </button>
            <button type="button" className={styles['settings-btn']} onClick={handleSettings} disabled={isGenerating}>
              Link settings
            </button>
          </div>
        </div>
      ) : (
        <div className={styles['setup-form']}>
          <p className={styles['info-text']}>
            Create a secure public link. Anyone with this link will have access based on the settings below.
          </p>

          <div className={styles.row}>
            <span className={styles['row-label']}>Access Level</span>
            <SelectMenu
              value = {
                role
              }
              options = {
                SHARE_ROLE_OPTIONS
              }
              onChange = {
                (next) => setRole(next as 'viewer' | 'collaborator')
              }
              variant = {
                'field'
              }
              menuTitle = {
                SHARE_ROLE_MENU_TITLE
              }
              aria-label = {
                'Access Level'
              }
            />
          </div>

          <div className={styles.row} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={styles['row-label']}>Expiration</span>
              <Switch
                id = {
                  'link-exp-toggle'
                }
                checked = {
                  hasExpiration
                }
                onChange = {
                  setHasExpiration
                }
                aria-label = {
                  hasExpiration ? 'Disable link expiration' : 'Enable link expiration'
                }
                size = {
                  'sm'
                }
              />
            </div>
            {hasExpiration && (
              <div className={styles['sub-details']}>
                <DateField
                  value = {
                    expDate
                  }
                  onChange = {
                    setExpDate
                  }
                  aria-label = {
                    'Link expiration date'
                  }
                  className = {
                    styles['date-field']
                  }
                />
                <input
                  type="time"
                  value={expTime}
                  onChange={(e) => setExpTime(e.target.value)}
                  className={styles['time-input']}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}
          </div>

          <div className={styles.row} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={styles['row-label']}>Password Protect</span>
              <Switch
                id = {
                  'link-pass-toggle'
                }
                checked = {
                  hasPassword
                }
                onChange = {
                  setHasPassword
                }
                aria-label = {
                  hasPassword ? 'Disable password protection' : 'Enable password protection'
                }
                size = {
                  'sm'
                }
              />
            </div>
            {hasPassword && (
              <div className={styles['sub-details']}>
                <Input
                  type = {
                    showPassword ? 'text' : 'password'
                  }
                  id = {
                    'link-share-password'
                  }
                  name = {
                    'link-share-password'
                  }
                  autoComplete = {
                    'new-password'
                  }
                  placeholder = {
                    'Set a secure password...'
                  }
                  value = {
                    password
                  }
                  onChange = {
                    (e) => setPassword(e.target.value)
                  }
                  leftIcon = {
                    <Lock size={16} />
                  }
                  rightIcon = {
                    <button
                      type = {
                        'button'
                      }
                      onClick = {
                        onToggleShowPassword
                      }
                      aria-label = {
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  }
                  rightIconClickable
                  aria-label = {
                    'Link password'
                  }
                  className = {
                    styles['password-field']
                  }
                />
              </div>
            )}
          </div>

          <Button
            variant = {
              'primary'
            }
            onClick = {
              handleGenerate
            }
            isLoading = {
              isGenerating
            }
            disabled = {
              hasPassword && !password
            }
            style = {
              { marginTop: '0.5rem', alignSelf: 'flex-end' }
            }
          >
            Generate Link
          </Button>
        </div>
      )}
    </div>
  );
};
