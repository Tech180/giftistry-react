import React from 'react';
import { AlertCircle, Check, Copy, Link2, Lock } from 'lucide-react';
import { Button, DateField, SelectMenu, Switch } from 'shared/ui';
import {
  SHARE_ROLE_MENU_TITLE,
  SHARE_ROLE_OPTIONS,
} from 'features/wishlists/constants/share-role-options.constant';
import { formatDateTime } from 'shared/utils/format-date.util';
import { TemplateProps } from './interfaces/template-props.interface';
import styles from './link.module.css';

export const LinkTabTemplate: React.FC<TemplateProps> = ({
  variant = 'classic',
  isOwner,
  isLoading,
  isGenerating,
  errorMsg,
  successMsg,
  activeInvite,
  generatedToken,
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

    const shareUrl = generatedToken
      ? `${window.location.origin}/invite/list/${generatedToken}`
      : '';
    const linkEnabled = Boolean(activeInvite);

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

          {linkEnabled && shareUrl && (
            <div className={styles.linkUrlBox}>
              <span className={styles.linkUrlText}>{shareUrl.replace(/^https?:\/\//, '')}</span>
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
      {successMsg && (
        <div className={`${styles.alert} ${styles['alert-success']}`}>
          <Check
            size = {
              16
            }
          />
          <span>{successMsg}</span>
        </div>
      )}

      {activeInvite ? (
        <div className={styles['setup-form']}>
          <div className={styles['active-link-box']}>
            <div className={styles['link-row']}>
              <div className={styles['user-details']} style={{ overflow: 'hidden' }}>
                <span className={`${styles['label']} ${styles['label--uppercase']}`}>Share Link</span>
                <span className={styles['link-text']}>
                  {generatedToken
                    ? `${window.location.origin}/invite/list/${generatedToken}`
                    : 'This link was created before URLs were stored. Use Link settings to generate a new one.'}
                </span>
              </div>
              {generatedToken && (
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
              <div className={styles['toggle-container']}>
                <input
                  type="checkbox"
                  id="link-exp-toggle"
                  checked={hasExpiration}
                  onChange={(e) => setHasExpiration(e.target.checked)}
                  className={styles['toggle-checkbox']}
                />
                <label htmlFor="link-exp-toggle" className={styles['toggle-slider']} />
              </div>
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
              <div className={styles['toggle-container']}>
                <input
                  type="checkbox"
                  id="link-pass-toggle"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className={styles['toggle-checkbox']}
                />
                <label htmlFor="link-pass-toggle" className={styles['toggle-slider']} />
              </div>
            </div>
            {hasPassword && (
              <div className={styles['sub-details']}>
                <input
                  type="text"
                  placeholder="Set a secure password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles['text-input']}
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
