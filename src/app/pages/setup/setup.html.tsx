import React from 'react';
import styles from './setup.module.css';
import { Database, Mail, User, Server, ArrowRight, ArrowLeft } from 'lucide-react';
import { SetupTemplateProps } from './interfaces/setup-props.interface';
import { SetupTimeline } from './components/timeline/setup-timeline.component';

export const SetupTemplate: React.FC<SetupTemplateProps> = ({
  step,
  dbType,
  dbUrl,
  smtpType,
  smtpHost,
  smtpPort,
  smtpUser,
  smtpPass,
  smtpSecure,
  smtpFrom,
  adminUsername,
  adminEmail,
  adminPassword,
  adminConfirmPassword,
  adminFirstName,
  adminLastName,
  errors,
  isSubmitting,
  onFieldChange,
  onNext,
  onPrev,
}) => {
  const renderDatabaseStep = () => (
    <div className={styles['form-section']}>
      <h3 className={styles['section-title']}>
        <Database size={16} className={styles['section-icon']} />
        Configure PostgreSQL Database
      </h3>

      <div className={styles['form-group']}>
        <label className={styles.label}>Database Location</label>
        <div className={styles['toggle-container']}>
          <button
            type="button"
            className={`${styles['toggle-btn']} ${dbType === 'local' ? styles['toggle-btn-active'] : ''}`}
            onClick={() => onFieldChange('dbType', 'local')}
          >
            Local (Embedded PostgreSQL)
          </button>
          <button
            type="button"
            className={`${styles['toggle-btn']} ${dbType === 'remote' ? styles['toggle-btn-active'] : ''}`}
            onClick={() => onFieldChange('dbType', 'remote')}
          >
            Remote / External Server
          </button>
        </div>
      </div>

      {dbType === 'local' ? (
        <div className={`${styles.banner} ${styles['banner-info']}`}>
          <Server size={16} className={styles['banner-icon']} />
          <div>
            This option uses the local PostgreSQL database built into the Nix environment. Perfect for plug-and-play setups.
          </div>
        </div>
      ) : (
        <div className={styles['form-group']}>
          <label htmlFor="dbUrl" className={styles.label}>PostgreSQL Connection URL</label>
          <input
            id="dbUrl"
            type="text"
            className={styles.input}
            placeholder="postgresql://user:password@host:port/database"
            value={dbUrl}
            onChange={(e) => onFieldChange('dbUrl', e.target.value)}
          />
          {errors.dbUrl && <span className={styles['field-error']}>{errors.dbUrl}</span>}
        </div>
      )}
    </div>
  );

  const renderSMTPStep = () => (
    <div className={styles['form-section']}>
      <h3 className={styles['section-title']}>
        <Mail size={16} className={styles['section-icon']} />
        Configure Mail Server (SMTP)
      </h3>

      <div className={styles['form-group']}>
        <label className={styles.label}>Mail Transport Location</label>
        <div className={styles['toggle-container']}>
          <button
            type="button"
            className={`${styles['toggle-btn']} ${smtpType === 'local' ? styles['toggle-btn-active'] : ''}`}
            onClick={() => onFieldChange('smtpType', 'local')}
          >
            Local (Embedded Mailpit)
          </button>
          <button
            type="button"
            className={`${styles['toggle-btn']} ${smtpType === 'remote' ? styles['toggle-btn-active'] : ''}`}
            onClick={() => onFieldChange('smtpType', 'remote')}
          >
            Remote / External SMTP
          </button>
        </div>
      </div>

      {smtpType === 'local' ? (
        <div className={`${styles.banner} ${styles['banner-info']}`}>
          <Server size={16} className={styles['banner-icon']} />
          <div>
            Emails will be sent to the Mailpit server interface running locally in the development sandbox.
          </div>
        </div>
      ) : (
        <>
          <div className={styles['form-group-inline']}>
            <div>
              <label htmlFor="smtpHost" className={styles.label}>SMTP Host</label>
              <input
                id="smtpHost"
                type="text"
                className={styles.input}
                placeholder="smtp.example.com"
                value={smtpHost}
                onChange={(e) => onFieldChange('smtpHost', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="smtpPort" className={styles.label}>SMTP Port</label>
              <input
                id="smtpPort"
                type="number"
                className={styles.input}
                placeholder="587"
                value={smtpPort || ''}
                onChange={(e) => onFieldChange('smtpPort', e.target.value ? parseInt(e.target.value) : '')}
              />
            </div>
          </div>

          <div className={styles['form-group-inline']}>
            <div>
              <label htmlFor="smtpUser" className={styles.label}>SMTP Username</label>
              <input
                id="smtpUser"
                type="text"
                className={styles.input}
                placeholder="user@example.com"
                value={smtpUser}
                onChange={(e) => onFieldChange('smtpUser', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="smtpPass" className={styles.label}>SMTP Password</label>
              <input
                id="smtpPass"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={smtpPass}
                onChange={(e) => onFieldChange('smtpPass', e.target.value)}
              />
            </div>
          </div>

          <div className={styles['form-group-inline']}>
            <div>
              <label htmlFor="smtpFrom" className={styles.label}>Sender Address (From)</label>
              <input
                id="smtpFrom"
                type="email"
                className={styles.input}
                placeholder="noreply@giftistry.local"
                value={smtpFrom}
                onChange={(e) => onFieldChange('smtpFrom', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: 24 }}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={smtpSecure}
                  onChange={(e) => onFieldChange('smtpSecure', e.target.checked)}
                />
                Secure connection
              </label>
            </div>
          </div>
          {errors.smtp && <span className={styles['field-error']}>{errors.smtp}</span>}
        </>
      )}
    </div>
  );

  const renderAdminStep = () => (
    <div className={styles['form-section']}>
      <h3 className={styles['section-title']}>
        <User size={16} className={styles['section-icon']} />
        Create Administrator Account
      </h3>

      <div className={styles['form-group-inline']}>
        <div>
          <label htmlFor="adminFirstName" className={styles.label}>First Name</label>
          <input
            id="adminFirstName"
            type="text"
            className={styles.input}
            placeholder="John"
            value={adminFirstName}
            onChange={(e) => onFieldChange('adminFirstName', e.target.value)}
          />
          {errors.adminFirstName && <span className={styles['field-error']}>{errors.adminFirstName}</span>}
        </div>
        <div>
          <label htmlFor="adminLastName" className={styles.label}>Last Name</label>
          <input
            id="adminLastName"
            type="text"
            className={styles.input}
            placeholder="Doe"
            value={adminLastName}
            onChange={(e) => onFieldChange('adminLastName', e.target.value)}
          />
          {errors.adminLastName && <span className={styles['field-error']}>{errors.adminLastName}</span>}
        </div>
      </div>

      <div className={styles['form-group-inline']}>
        <div>
          <label htmlFor="adminUsername" className={styles.label}>Username</label>
          <input
            id="adminUsername"
            type="text"
            className={styles.input}
            placeholder="admin"
            value={adminUsername}
            onChange={(e) => onFieldChange('adminUsername', e.target.value)}
          />
          {errors.adminUsername && <span className={styles['field-error']}>{errors.adminUsername}</span>}
        </div>
        <div>
          <label htmlFor="adminEmail" className={styles.label}>Email Address</label>
          <input
            id="adminEmail"
            type="email"
            className={styles.input}
            placeholder="admin@example.com"
            value={adminEmail}
            onChange={(e) => onFieldChange('adminEmail', e.target.value)}
          />
          {errors.adminEmail && <span className={styles['field-error']}>{errors.adminEmail}</span>}
        </div>
      </div>

      <div className={styles['form-group-inline']}>
        <div>
          <label htmlFor="adminPassword" className={styles.label}>Password</label>
          <input
            id="adminPassword"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={adminPassword}
            onChange={(e) => onFieldChange('adminPassword', e.target.value)}
          />
          {errors.adminPassword && <span className={styles['field-error']}>{errors.adminPassword}</span>}
        </div>
        <div>
          <label htmlFor="adminConfirmPassword" className={styles.label}>Confirm Password</label>
          <input
            id="adminConfirmPassword"
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={adminConfirmPassword}
            onChange={(e) => onFieldChange('adminConfirmPassword', e.target.value)}
          />
          {errors.adminConfirmPassword && <span className={styles['field-error']}>{errors.adminConfirmPassword}</span>}
        </div>
      </div>
    </div>
  );

  const renderInstallingStep = () => (
    <div className={styles['installing-container']}>
      <div className={styles.spinner} />
      <h3 className={styles['installing-text']}>Setting up your homelab...</h3>
      <p className={styles['installing-subtext']}>
        Initializing PostgreSQL tables, seeding dynamic fields, writing config.json, and registering your administrator credentials.
      </p>
    </div>
  );

  return (
    <div className={styles['setup-container']}>
      <aside className={styles['setup-sidebar']}>
        <div className={styles['sidebar-header']}>
          <h1 className={styles['setup-title']}>Giftistry Setup</h1>
          <p className={styles['setup-subtitle']}>Configure instance settings to finish installation</p>
        </div>
        <SetupTimeline step={step} />
      </aside>

      <main className={styles['setup-content']}>
        <form onSubmit={(e) => e.preventDefault()} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            {step === 1 && renderDatabaseStep()}
            {step === 2 && renderSMTPStep()}
            {step === 3 && renderAdminStep()}
            {step === 4 && renderInstallingStep()}
          </div>

          {step < 4 && (
            <div className={styles['setup-footer']}>
              {step > 1 ? (
                <button type="button" className={styles['btn-prev']} onClick={onPrev}>
                  <ArrowLeft size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                className={styles['btn-next']}
                onClick={onNext}
                disabled={isSubmitting}
              >
                {step === 3 ? 'Install & Bootstrap' : 'Continue'}
                <ArrowRight size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};
