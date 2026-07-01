import React from 'react';
import { Fingerprint, Trash2 } from 'lucide-react';
import { PasskeysSectionProps } from '../interfaces/passkeys-section-props.interface';
import styles from '../security-tab.module.css';

export const PasskeysSection: React.FC<PasskeysSectionProps> = ({
  handleRegisterPasskey,
  passkeys,
  handleDeletePasskey,
  deletingPasskeyId,
  setDeletingPasskeyId,
}) => {
  return (
    <section className={`${styles.section} ${styles.fullWidthSection}`}>
      <h2 className={styles.sectionHeader}>Passkeys</h2>
      <div className={styles.settingList}>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span className={styles.settingLabel}>Device Passkeys</span>
            <span className={styles.settingDesc}>Sign in securely using Touch ID, Face ID, Windows Hello, or a security key.</span>
          </div>
          <div className={styles.settingAction}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleRegisterPasskey}
            >
              Add passkey
            </button>
          </div>
        </div>

        {/* Passkeys list rows */}
        {passkeys.map((pk) => {
          const label = `Passkey (••••${(pk.CredentialId || '').slice(-6)})`;
          const isDeleting = deletingPasskeyId === pk.Id;
          return (
            <div key={pk.Id} className={styles.settingRow}>
              {isDeleting ? (
                <div className={`${styles.flexRow} ${styles.justifyBetween} ${styles.wFull} ${styles.alignCenter}`}>
                  <span className={`${styles.settingLabel} ${styles.dangerText}`}>Remove this passkey?</span>
                  <div className={`${styles.flexRow} ${styles.gap2}`}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => handleDeletePasskey(pk.Id)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => setDeletingPasskeyId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`${styles.flexRow} ${styles.justifyBetween} ${styles.wFull} ${styles.alignCenter}`}>
                  <div className={`${styles.flexRow} ${styles.alignCenter} ${styles.gap3}`}>
                    <Fingerprint size={16} className={styles.mutedIcon} />
                    <div className={`${styles.flexRow} ${styles.alignCenter} ${styles.gap2} ${styles.flexWrap}`}>
                      <span className={styles.settingLabel}>{label}</span>
                      <div className={`${styles.flexRow} ${styles.gap1}`}>
                        {pk.BackedUp && (
                           <span className={`${styles.badge} ${styles.badgeSuccess}`}>Synced</span>
                        )}
                        {(pk.Transports || []).map((transport: string) => (
                          <span key={transport} className={`${styles.badge} ${styles.badgeInfo}`}>
                            {transport}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteIconBtn}
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
          <div className={styles.passkeyWarning}>
            <span>⚠️</span>
            <span>You only have one passkey registered. If you delete it, you will need to sign in using your account password or email codes.</span>
          </div>
        )}
      </div>
    </section>
  );
};
