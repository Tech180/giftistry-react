import React from 'react';
import { Fingerprint, Trash2 } from 'lucide-react';
import { PasskeysSectionProps } from '../interfaces/passkeys-section-props.interface';
import styles from './passkeys-section.module.css';

export const PasskeysSectionTemplate: React.FC<PasskeysSectionProps> = ({
  handleRegisterPasskey,
  passkeys,
  handleDeletePasskey,
  deletingPasskeyId,
  setDeletingPasskeyId,
}) => {
  return (
    <section className={`${styles.section} ${styles['full-width-section']}`}>
      <h2 className={styles['section-header']}>Passkeys</h2>
      <div className={styles['setting-list']}>
        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Device Passkeys</span>
            <span className={styles['setting-desc']}>Sign in securely using Touch ID, Face ID, Windows Hello, or a security key.</span>
          </div>
          <div className={styles['setting-action']}>
            <button
              type="button"
              className={`${styles.btn} ${styles['btn-secondary']}`}
              onClick={handleRegisterPasskey}
            >
              Add passkey
            </button>
          </div>
        </div>

        {passkeys.map((pk) => {
          const label = `Passkey (••••${(pk.CredentialId || '').slice(-6)})`;
          const isDeleting = deletingPasskeyId === pk.Id;
          return (
            <div key={pk.Id} className={styles['setting-row']}>
              {isDeleting ? (
                <div className={`${styles['flex-row']} ${styles['justify-between']} ${styles['w-full']} ${styles['align-center']}`}>
                  <span className={`${styles['setting-label']} ${styles['danger-text']}`}>Remove this passkey?</span>
                  <div className={`${styles['flex-row']} ${styles.gap2}`}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles['btn-danger']}`}
                      onClick={() => handleDeletePasskey(pk.Id)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles['btn-secondary']}`}
                      onClick={() => setDeletingPasskeyId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`${styles['flex-row']} ${styles['justify-between']} ${styles['w-full']} ${styles['align-center']}`}>
                  <div className={`${styles['flex-row']} ${styles['align-center']} ${styles.gap3}`}>
                    <Fingerprint size={16} className={styles['muted-icon']} />
                    <div className={`${styles['flex-row']} ${styles['align-center']} ${styles.gap2} ${styles['flex-wrap']}`}>
                      <span className={styles['setting-label']}>{label}</span>
                      <div className={`${styles['flex-row']} ${styles.gap1}`}>
                        {pk.BackedUp && (
                          <span className={`${styles.badge} ${styles['badge-success']}`}>Synced</span>
                        )}
                        {(pk.Transports || []).map((transport: string) => (
                          <span key={transport} className={`${styles.badge} ${styles['badge-info']}`}>
                            {transport}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles['delete-icon-btn']}
                    onClick={() => setDeletingPasskeyId(pk.Id)}
                    title="Remove passkey"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {passkeys.length === 1 && (
          <div className={styles['passkey-warning']}>
            <span>⚠️</span>
            <span>You only have one passkey registered. If you delete it, you will need to sign in using your account password or email codes.</span>
          </div>
        )}
      </div>
    </section>
  );
};
