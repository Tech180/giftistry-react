import React from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { ServerSettingsTabProps } from './interfaces/server-settings-tab-props.interface';
import styles from './server-settings-tab.module.css';

export const ServerSettingsTabTemplate: React.FC<ServerSettingsTabProps> = ({
  dbType,
  setDbType,
  dbUrl,
  setDbUrl,
  smtpType,
  setSmtpType,
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpUser,
  setSmtpUser,
  smtpPass,
  setSmtpPass,
  smtpSecure,
  setSmtpSecure,
  smtpFrom,
  setSmtpFrom,
  showPassword,
  setShowPassword,
  isLoading,
  isSaving,
  handleSave,
}) => {
  if (isLoading) {
    return (
      <div className={styles.tabPane} style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <span className={styles.spinner} style={{ width: '32px', height: '32px', color: 'var(--primary)' }}></span>
      </div>
    );
  }

  return (
    <div className={styles.tabPane}>
      <form onSubmit={handleSave} className={styles.settingsContainer}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Server Configuration</h2>
            <p className={styles.pageSubtitle}>Configure database connection settings and mail delivery options for this homelab instance.</p>
          </div>
          <div>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className={styles.spinner}></span>
              ) : (
                <Save size={14} />
              )}
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Database Configuration Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>PostgreSQL Database</h2>
          <div className={styles.settingList}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Connection Location</span>
                <span className={styles.settingDesc}>Use local embedded Nix or connect externally.</span>
              </div>
              <div className={styles.settingAction}>
                <div className={styles.segmentedControl}>
                  <button
                    type="button"
                    className={`${styles.segmentBtn} ${dbType === 'local' ? styles.segmentBtnActive : ''}`}
                    onClick={() => setDbType('local')}
                  >
                    Local
                  </button>
                  <button
                    type="button"
                    className={`${styles.segmentBtn} ${dbType === 'remote' ? styles.segmentBtnActive : ''}`}
                    onClick={() => setDbType('remote')}
                  >
                    Remote
                  </button>
                </div>
              </div>
            </div>

            <div className={`${styles.expandableArea} ${dbType === 'remote' ? styles.expandableAreaActive : ''}`}>
              <div className={styles.inputWrapper}>
                <label className={styles.inputLabel}>Connection URL</label>
                <div className={styles.inputBox}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="postgresql://user:pass@host:5432/db"
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    required={dbType === 'remote'}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMTP Mail Server Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeader}>SMTP Mail Server</h2>
          <div className={styles.settingList}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Transport Service</span>
                <span className={styles.settingDesc}>Local routes to Mailpit catcher. Remote sends via SMTP.</span>
              </div>
              <div className={styles.settingAction}>
                <div className={styles.segmentedControl}>
                  <button
                    type="button"
                    className={`${styles.segmentBtn} ${smtpType === 'local' ? styles.segmentBtnActive : ''}`}
                    onClick={() => setSmtpType('local')}
                  >
                    Local
                  </button>
                  <button
                    type="button"
                    className={`${styles.segmentBtn} ${smtpType === 'remote' ? styles.segmentBtnActive : ''}`}
                    onClick={() => setSmtpType('remote')}
                  >
                    Remote
                  </button>
                </div>
              </div>
            </div>

            <div className={`${styles.expandableArea} ${smtpType === 'remote' ? styles.expandableAreaActive : ''}`}>
              <div className={styles.formGrid}>
                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Host</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="smtp.example.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    required={smtpType === 'remote'}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Port</label>
                  <input
                    type="number"
                    className={styles.inputField}
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    required={smtpType === 'remote'}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Username</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="user@example.com"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>Password</label>
                  <div className={styles.inputBox}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={styles.inputField}
                      placeholder="Secret"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.inputIconBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                  <label className={styles.switchLabel}>
                    <div className={styles.settingInfo}>
                      <span className={styles.settingLabel}>Require TLS/SSL</span>
                      <span className={styles.settingDesc} style={{ fontSize: '12px' }}>Enforce secure connection to the mail server.</span>
                    </div>
                    <div className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={smtpSecure}
                        onChange={(e) => setSmtpSecure(e.target.checked)}
                      />
                      <span className={styles.slider}></span>
                    </div>
                  </label>
                </div>

                <div className={styles.inputWrapper} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.inputLabel}>Sender Address (From)</label>
                  <input
                    type="email"
                    className={styles.inputField}
                    placeholder="noreply@domain.com"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    required={smtpType === 'remote'}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
};

export default ServerSettingsTabTemplate;
