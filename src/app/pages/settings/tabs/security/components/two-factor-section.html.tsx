import React from 'react';
import { Copy, Download, Fingerprint, Smartphone, Trash2, X } from 'lucide-react';
import { TwoFactorSectionTemplateProps } from '../interfaces/two-factor-section-props.interface';
import styles from './two-factor-section.module.css';

const AccountUsernameField: React.FC<{ accountUsername: string }> = ({ accountUsername }) => {
  if (!accountUsername) {
    return null;
  }

  return (
    <input
      type="text"
      name="username"
      autoComplete="username"
      defaultValue={accountUsername}
      readOnly
      tabIndex={-1}
      aria-hidden="true"
      className={styles['sr-only']}
    />
  );
};

const OtpInput: React.FC<{
  id: string;
  placeholder: string;
  inline?: boolean;
}> = ({ id, placeholder, inline = false }) => (
  <input
    type="tel"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={6}
    id={id}
    name="otp"
    autoComplete="one-time-code"
    aria-label="One-time verification code"
    placeholder={placeholder}
    className={`${styles['code-input']} ${inline ? styles['code-input-inline'] : ''}`}
    spellCheck={false}
    autoCorrect="off"
    required
  />
);

export const TwoFactorSectionTemplate: React.FC<TwoFactorSectionTemplateProps> = ({
  is2faEnabled,
  qrCodeUrl,
  totpSecret,
  accountUsername,
  handleEnable2FA,
  handleDisable2FA,
  recoveryCodes,
  flowStep,
  isExpanded,
  savedCodesConfirmed,
  setSavedCodesConfirmed,
  onToggleSetup,
  onToggleViewRecovery,
  onToggleDisable,
  onCloseExpandable,
  onCompleteSetup,
  handleCopySecret,
  handleCopyRecoveryCodes,
  handleDownloadRecoveryCodes,
  handleRegisterPasskey,
  passkeys,
  handleDeletePasskey,
  deletingPasskeyId,
  setDeletingPasskeyId,
}) => {
  return (
    <section className={styles.section}>
      <h2 className={styles['section-label']}>Two-step verification methods</h2>

      <div className={styles.card}>
        {/* Authenticator App */}
        <div className={`${styles['method-row']} ${styles['method-row-bordered']}`}>
          <div className={styles['method-header']}>
            <div className={styles['method-main']}>
              <div className={styles['status-column']}>
                <div className={styles['method-icon']}>
                  <Smartphone size={16} />
                </div>
                <span
                  className={`${styles.badge} ${is2faEnabled ? styles['badge-active'] : styles['badge-off']}`}
                >
                  {is2faEnabled ? 'ACTIVE' : 'OFF'}
                </span>
              </div>

              <div className={styles['method-content']}>
                <h3 className={styles['method-title']}>Authenticator App</h3>
                <p className={styles['method-desc']}>
                  Use an app like 1Password or Google Authenticator to generate one-time codes.
                </p>
              </div>
            </div>

            <div className={styles['method-actions']}>
              {!is2faEnabled ? (
                <button type="button" className={`${styles.btn} ${styles['btn-solid']}`} onClick={onToggleSetup}>
                  Set up
                </button>
              ) : (
                <div className={styles['action-group']}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles['btn-outline']}`}
                    onClick={onToggleViewRecovery}
                    disabled={recoveryCodes.length === 0}
                  >
                    Recovery Codes
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-danger-text']}`}
                    onClick={onToggleDisable}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`${styles['expandable-wrapper']} ${isExpanded ? styles['expandable-wrapper-expanded'] : ''}`}>
            <div className={styles['expandable-inner']}>
              {isExpanded && flowStep && (
                <div className={styles['flow-panel']}>
                  {flowStep === 'setup-qr' && (
                    <div className={styles['flow-step-active']}>
                      <div className={styles['flow-header']}>
                        <h4 className={styles['flow-title']}>Configure your app</h4>
                        <button type="button" className={styles['btn-close']} onClick={onCloseExpandable} aria-label="Close">
                          <X size={14} />
                        </button>
                      </div>

                      <div className={styles['setup-panel']}>
                        {qrCodeUrl && (
                          <div className={styles['qr-frame']}>
                            <img src={qrCodeUrl} alt="2FA QR Code" className={styles['qr-image']} />
                          </div>
                        )}

                        <div className={styles['setup-form-col']}>
                          {totpSecret && (
                            <div className={styles['secret-row']}>
                              <span className={styles['secret-label']}>Secret Key</span>
                              <div className={styles['secret-value-wrap']}>
                                <code className={styles['secret-value']}>{totpSecret.replace(/\s/g, '')}</code>
                                <button
                                  type="button"
                                  className={styles['btn-icon']}
                                  onClick={handleCopySecret}
                                  title="Copy code"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          <form
                            key={`setup-${totpSecret}`}
                            onSubmit={handleEnable2FA}
                            className={styles['verify-form']}
                            autoComplete="on"
                          >
                            <AccountUsernameField accountUsername={accountUsername} />
                            <label htmlFor="otp-setup" className={styles['verify-label']}>
                              Verification code
                            </label>
                            <div className={styles['verify-input-row']}>
                              <OtpInput id="otp-setup" placeholder="Enter 6-digit code" />
                              <button type="submit" className={`${styles.btn} ${styles['btn-solid']} ${styles['btn-sm']}`}>
                                Verify
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {flowStep === 'setup-recovery' && (
                    <div className={styles['flow-step-active']}>
                      <div className={styles['flow-header']}>
                        <h4 className={styles['flow-title']}>Save recovery codes</h4>
                        <button type="button" className={styles['btn-close']} onClick={onCloseExpandable} aria-label="Close">
                          <X size={14} />
                        </button>
                      </div>

                      <div className={`${styles['recovery-panel']} ${styles['recovery-panel-hover']}`}>
                        <div className={styles['recovery-grid']}>
                          {recoveryCodes.map((code) => (
                            <div key={code} className={styles['recovery-code-cell']}>
                              {code}
                            </div>
                          ))}
                        </div>
                        <div className={styles['recovery-actions']}>
                          <button
                            type="button"
                            className={styles['recovery-action-btn']}
                            onClick={handleCopyRecoveryCodes}
                            title="Copy all"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles['recovery-action-btn']}
                            onClick={handleDownloadRecoveryCodes}
                            title="Download .txt"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </div>

                      <div className={styles['recovery-footer']}>
                        <label className={styles['checkbox-label']}>
                          <input
                            type="checkbox"
                            className={styles['confirm-checkbox']}
                            checked={savedCodesConfirmed}
                            onChange={(e) => setSavedCodesConfirmed(e.target.checked)}
                          />
                          <span className={styles['checkbox-label-text']}>I saved these securely</span>
                        </label>
                        <button
                          type="button"
                          className={`${styles.btn} ${styles['btn-solid']} ${styles['btn-sm']}`}
                          disabled={!savedCodesConfirmed}
                          onClick={onCompleteSetup}
                        >
                          Complete Setup
                        </button>
                      </div>
                    </div>
                  )}

                  {flowStep === 'view-recovery' && (
                    <div className={styles['flow-step-active']}>
                      <div className={styles['flow-header-split']}>
                        <div>
                          <h4 className={styles['flow-title']}>Recovery Codes</h4>
                          <p className={styles['flow-subtitle']}>Fallback codes if you lose your device.</p>
                        </div>
                        <div className={styles['flow-header-actions']}>
                          <button
                            type="button"
                            className={styles['recovery-action-btn']}
                            onClick={handleCopyRecoveryCodes}
                            title="Copy all"
                            aria-label="Copy recovery codes"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            className={styles['recovery-action-btn']}
                            onClick={handleDownloadRecoveryCodes}
                            title="Download .txt"
                            aria-label="Download recovery codes"
                          >
                            <Download size={14} />
                          </button>
                          <span className={styles['flow-divider']} />
                          <button type="button" className={styles['btn-close']} onClick={onCloseExpandable} aria-label="Close">
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className={styles['recovery-panel']}>
                        <div className={styles['recovery-grid']}>
                          {recoveryCodes.map((code) => (
                            <div key={code} className={styles['recovery-code-cell']}>
                              {code}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {flowStep === 'disable' && (
                    <div className={styles['flow-step-active']}>
                      <div className={styles['flow-header']}>
                        <h4 className={`${styles['flow-title']} ${styles['flow-title-danger']}`}>Remove Authenticator App</h4>
                        <button type="button" className={styles['btn-close']} onClick={onCloseExpandable} aria-label="Close">
                          <X size={14} />
                        </button>
                      </div>

                      <form
                        key="disable-otp"
                        onSubmit={handleDisable2FA}
                        className={styles['disable-form']}
                        autoComplete="on"
                      >
                        <AccountUsernameField accountUsername={accountUsername} />
                        <label htmlFor="otp-disable" className={styles['verify-label']}>
                          Verification code
                        </label>
                        <div className={styles['verify-input-row']}>
                          <OtpInput id="otp-disable" placeholder="Enter app code to confirm" inline />
                          <button type="submit" className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-sm']}`}>
                            Confirm Removal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Passkeys */}
        <div className={styles['method-row']}>
          <div className={styles['method-header']}>
            <div className={styles['method-main']}>
              <div className={styles['status-column']}>
                <div className={styles['method-icon']}>
                  <Fingerprint size={16} />
                </div>
                <span
                  className={`${styles.badge} ${styles['badge-count']} ${passkeys.length > 0 ? styles['badge-count-active'] : ''}`}
                >
                  {passkeys.length}
                </span>
              </div>

              <div className={styles['method-content']}>
                <h3 className={styles['method-title']}>Passkeys</h3>
                <p className={styles['method-desc']}>
                  Sign in securely using Touch ID, Face ID, Windows Hello, or a security key.
                </p>
              </div>
            </div>

            <div className={styles['method-actions']}>
              <button
                type="button"
                className={`${styles.btn} ${styles['btn-outline']}`}
                onClick={handleRegisterPasskey}
              >
                Add passkey
              </button>
            </div>
          </div>

          {passkeys.length > 0 && (
            <div className={styles['passkey-list']}>
              {passkeys.map((pk) => {
                const label = `Passkey (••••${(pk.CredentialId || '').slice(-6)})`;
                const isDeleting = deletingPasskeyId === pk.Id;

                return (
                  <div key={pk.Id} className={styles['passkey-row']}>
                    {isDeleting ? (
                      <div className={styles['passkey-confirm-row']}>
                        <span className={styles['passkey-confirm-label']}>Remove this passkey?</span>
                        <div className={styles['passkey-confirm-actions']}>
                          <button
                            type="button"
                            className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-sm']}`}
                            onClick={() => handleDeletePasskey(pk.Id)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-sm']}`}
                            onClick={() => setDeletingPasskeyId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles['passkey-row-main']}>
                          <Fingerprint size={16} className={styles['icon-muted']} />
                          <span className={styles['passkey-label']}>{label}</span>
                          <div className={styles['passkey-badges']}>
                            {pk.BackedUp && (
                              <span className={`${styles['passkey-badge']} ${styles['passkey-badge-success']}`}>
                                Synced
                              </span>
                            )}
                            {(pk.Transports || []).map((transport: string) => (
                              <span
                                key={transport}
                                className={`${styles['passkey-badge']} ${styles['passkey-badge-info']}`}
                              >
                                {transport}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles['passkey-delete-btn']}
                          onClick={() => setDeletingPasskeyId(pk.Id)}
                          title="Remove passkey"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}

              {passkeys.length === 1 && (
                <div className={styles['passkey-warning']}>
                  <span>⚠️</span>
                  <span>
                    You only have one passkey registered. If you delete it, you will need to sign in using your account password or email codes.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
