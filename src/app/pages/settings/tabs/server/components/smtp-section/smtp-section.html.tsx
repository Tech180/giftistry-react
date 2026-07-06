import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Switch } from 'shared/ui';
import { SmtpSectionProps } from '../../interfaces/smtp-section-props.interface';
import styles from './smtp-section.module.css';

export const SmtpSectionTemplate: React.FC<SmtpSectionProps> = ({
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
}) => {
  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>SMTP Mail Server</h2>
      <div className={styles['setting-list']}>
        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Transport Service</span>
            <span className={styles['setting-desc']}>Local routes to Mailpit catcher. Remote sends via SMTP.</span>
          </div>
          <div className={styles['setting-action']}>
            <div className={styles['segmented-control']}>
              <button
                type="button"
                className={`${styles['segment-btn']} ${smtpType === 'local' ? styles['segment-btn-active'] : ''}`}
                onClick={() => setSmtpType('local')}
              >
                Local
              </button>
              <button
                type="button"
                className={`${styles['segment-btn']} ${smtpType === 'remote' ? styles['segment-btn-active'] : ''}`}
                onClick={() => setSmtpType('remote')}
              >
                Remote
              </button>
            </div>
          </div>
        </div>

        <div className={`${styles['expandable-area']} ${smtpType === 'remote' ? styles['expandable-area-active'] : ''}`}>
          <div className={styles['expandable-content']}>
            <div className={styles['expandable-inner']}>
              <div className={styles['form-grid']}>
                {/* Host & Port Row */}
                <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>Host</label>
                    <input
                      type="text"
                      className={styles['input-field']}
                      placeholder="smtp.example.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      required={smtpType === 'remote'}
                    />
                  </div>

                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>Port</label>
                    <input
                      type="number"
                      className={styles['input-field']}
                      placeholder="587"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      required={smtpType === 'remote'}
                    />
                  </div>
                </div>

                {/* Username & Password Row */}
                <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>Username</label>
                    <input
                      type="text"
                      className={styles['input-field']}
                      placeholder="user@example.com"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                    />
                  </div>

                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>Password</label>
                    <div className={styles['input-box']}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={styles['input-field']}
                        placeholder="Secret"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                      />
                      <button
                        type="button"
                        className={styles['input-icon-btn']}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Require TLS/SSL */}
                <div className={styles['input-wrapper']} style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                  <label className={styles['switch-label']}>
                    <div className={styles['setting-info']}>
                      <span className={styles['setting-label']}>Require TLS/SSL</span>
                      <span className={styles['setting-desc']} style={{ fontSize: '12px' }}>Enforce secure connection to the mail server.</span>
                    </div>
                    <Switch
                      checked={smtpSecure}
                      onChange={setSmtpSecure}
                      aria-label="Require TLS/SSL"
                    />
                  </label>
                </div>

                {/* Sender Address */}
                <div className={styles['input-wrapper']} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles['input-label']}>Sender Address (From)</label>
                  <input
                    type="email"
                    className={styles['input-field']}
                    placeholder="noreply@domain.com"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    required={smtpType === 'remote'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SmtpSectionTemplate;
