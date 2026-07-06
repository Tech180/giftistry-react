import React from 'react';
import { AlertCircle, Check, Copy, Lock } from 'lucide-react';
import { Button } from 'shared/ui';
import styles from '../../../panel.module.css';
import { LinkTabTemplateProps } from './interfaces/link.interface';

export const LinkTabTemplate: React.FC<LinkTabTemplateProps> = ({
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
}) => {
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
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className={`${styles.alert} ${styles['alert-success']}`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {activeInvite ? (
        <div className={styles['setup-form']}>
          <div className={styles['active-link-box']}>
            <div className={styles['link-row']}>
              <div className={styles['user-details']} style={{ overflow: 'hidden' }}>
                <span className={styles['label']} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Share Link</span>
                <span className={styles['link-text']}>
                  {generatedToken ? `${window.location.origin}/invite/list/${generatedToken}` : 'Link Active (Token hidden for security)'}
                </span>
              </div>
              {generatedToken && (
                <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={<Copy size={12} />}>
                  {copied ? 'Copied' : 'Copy'}
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
                {activeInvite.ExpiresAt ? new Date(activeInvite.ExpiresAt).toLocaleString() : 'Never'}
              </span>
            </div>
            {activeInvite.PasswordProtected && (
              <div className={styles['info-item']}>
                <span className={styles['info-label']}>Password</span>
                <span className={styles['info-value-success']}>
                  <Lock size={12} /> Enabled
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
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'collaborator')}
              className={styles['minimal-select']}
            >
              <option value="viewer">Can view</option>
              <option value="collaborator">Can edit</option>
            </select>
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
                <input
                  type="date"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className={styles['date-input']}
                  style={{ colorScheme: 'dark' }}
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
            variant="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={hasPassword && !password}
            style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}
          >
            Generate Link
          </Button>
        </div>
      )}
    </div>
  );
};
