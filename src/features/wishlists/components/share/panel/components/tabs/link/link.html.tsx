import React from 'react';
import { AlertCircle, Check, Copy, Link2, Lock } from 'lucide-react';
import { Button, Switch } from 'shared/ui';
import styles from '../../../panel.module.css';
import fabStyles from '../../../../share-fab-panel/share-fab-panel.module.css';
import { LinkTabTemplateProps } from './interfaces/link.interface';

export const LinkTabTemplate: React.FC<LinkTabTemplateProps> = ({
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
      return <p className={fabStyles.compactStatus}>Only the wishlist owner can manage share links.</p>;
    }

    if (isLoading) {
      return <p className={fabStyles.compactStatus}>Checking link status...</p>;
    }

    const shareUrl = generatedToken
      ? `${window.location.origin}/invite/list/${generatedToken}`
      : '';
    const linkEnabled = Boolean(activeInvite);

    return (
      <div className={fabStyles.compactRoot}>
        {errorMsg && <p className={fabStyles.compactAlert}>{errorMsg}</p>}

        <div className={fabStyles.linkCard}>
          <div className={fabStyles.linkHeader}>
            <div className={fabStyles.linkInfo}>
              <div className={fabStyles.linkIconWrap}>
                <Link2 size={16} aria-hidden />
              </div>
              <span className={fabStyles.linkLabel}>
                {linkEnabled ? 'Link sharing on' : 'Link sharing off'}
              </span>
            </div>
            <Switch
              checked={linkEnabled}
              onChange={handleToggleLink}
              disabled={isGenerating}
              aria-label={linkEnabled ? 'Turn off link sharing' : 'Turn on link sharing'}
              size="sm"
            />
          </div>

          {linkEnabled && shareUrl && (
            <div className={fabStyles.linkUrlBox}>
              <span className={fabStyles.linkUrlText}>{shareUrl.replace(/^https?:\/\//, '')}</span>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                className={fabStyles.copyBtn}
                onClick={() => void handleCopy()}
                disabled={isGenerating}
                aria-label={copied ? 'Copied' : 'Copy link'}
                title={copied ? 'Copied' : 'Copy link'}
              >
                {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              </Button>
            </div>
          )}
        </div>

        <p className={fabStyles.linkHelper}>
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
                  {generatedToken
                    ? `${window.location.origin}/invite/list/${generatedToken}`
                    : 'This link was created before URLs were stored. Use Link settings to generate a new one.'}
                </span>
              </div>
              {generatedToken && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={handleCopy}
                  aria-label={copied ? 'Copied' : 'Copy link'}
                  title={copied ? 'Copied' : 'Copy link'}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
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
