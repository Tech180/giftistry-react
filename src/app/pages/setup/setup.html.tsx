import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  AtSign,
  Info,
  Check,
  Loader2,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BrandMark } from 'shared/ui';
import styles from './setup.module.css';
import { SetupTemplateProps } from './interfaces/setup-props.interface';
import { SetupTimeline } from './components/timeline/setup-timeline.component';

export const SetupTemplate: React.FC<SetupTemplateProps> = ({
  step,
  mobileStep,
  showFooterBack,
  showFooter,
  dbType,
  dbUrl,
  adminUsername,
  adminPassword,
  adminConfirmPassword,
  adminFirstName,
  adminLastName,
  showPassword,
  showConfirmPassword,
  errors,
  isSubmitting,
  installTasks,
  onFieldChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onNext,
  onPrev,
  onFinish,
}) => (
  <div className={styles['setup-shell']}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <BrandMark size="lg" showLabel={false} className={styles['brand-icon']} />
        <div className={styles['brand-text']}>
          <h1 className={styles['brand-title']}>Giftistry</h1>
          <p className={styles['brand-subtitle']}>Setup Wizard</p>
        </div>
      </div>

      <SetupTimeline step={step} />

      <div className={styles['sidebar-footer']}>
        <p className={styles['sidebar-meta']}>Giftistry Setup</p>
      </div>
    </aside>

    <main className={styles.main}>
      <header className={styles['mobile-header']}>
        <div className={styles['mobile-brand']}>
          <BrandMark size="sm" showLabel={false} />
          <span className={styles['mobile-title']}>Giftistry Setup</span>
        </div>
        <div className={styles['mobile-step']}>Step {mobileStep} of 3</div>
      </header>

      <div className={styles['main-scroll']}>
        <div className={styles['main-inner']}>
          {step === 1 && (
            <div className={`${styles['step-content']} ${styles['step-content-active']}`}>
              <header className={styles['step-header']}>
                <h2 className={styles['step-heading']}>Database Configuration</h2>
                <p className={styles['step-subheading']}>
                  Select how you want to store application data. For standard deployments, the
                  local option requires zero configuration.
                </p>
              </header>

              <div className={styles['radio-list']}>
                <label className={styles['radio-card']}>
                  <input
                    type="radio"
                    name="db_type"
                    value="local"
                    className={styles['radio-input']}
                    checked={dbType === 'local'}
                    onChange={() => onFieldChange('dbType', 'local')}
                  />
                  <div className={styles['radio-card-ui']}>
                    <div className={styles['radio-circle']} />
                    <div className={styles['radio-body']}>
                      <div className={styles['radio-title-row']}>
                        <span className={styles['radio-title']}>Local PostgreSQL</span>
                        <span className={styles.badge}>Recommended</span>
                      </div>
                      <p className={styles['radio-desc']}>
                        Use the local PostgreSQL database from your environment. Best for
                        personal use or small-scale deployments without an external database
                        server.
                      </p>
                    </div>
                  </div>
                </label>

                <label className={styles['radio-card']}>
                  <input
                    type="radio"
                    name="db_type"
                    value="remote"
                    className={styles['radio-input']}
                    checked={dbType === 'remote'}
                    onChange={() => onFieldChange('dbType', 'remote')}
                  />
                  <div className={styles['radio-card-ui']}>
                    <div className={styles['radio-circle']} />
                    <div className={styles['radio-body']}>
                      <span className={styles['radio-title']}>External PostgreSQL</span>
                      <p className={styles['radio-desc']}>
                        Connect to a dedicated database server for higher performance,
                        reliability, and scaling in production environments.
                      </p>
                      {dbType === 'remote' && (
                        <div className={styles['remote-fields']}>
                          <label htmlFor="dbUrl" className={styles.label}>
                            Connection URL
                          </label>
                          <input
                            id="dbUrl"
                            type="text"
                            className={`${styles.input} ${
                              errors.dbUrl ? styles['input-error'] : ''
                            }`}
                            placeholder="postgres://username:password@hostname:5432/database"
                            value={dbUrl}
                            onChange={(e) => onFieldChange('dbUrl', e.target.value)}
                            autoComplete="off"
                          />
                          {errors.dbUrl && (
                            <p className={styles['field-error']}>{errors.dbUrl}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={`${styles['step-content']} ${styles['step-content-active']}`}>
              <header className={styles['step-header']}>
                <h2 className={styles['step-heading']}>Create Administrator</h2>
                <p className={styles['step-subheading']}>
                  Set up the initial primary account. This user will have full administrative
                  privileges over the instance.
                </p>
              </header>

              {errors.setup && <p className={styles['setup-error']}>{errors.setup}</p>}

              <div className={styles['form-stack']}>
                <div className={styles['form-grid']}>
                  <div>
                    <label htmlFor="adminFirstName" className={styles.label}>
                      First Name
                    </label>
                    <input
                      id="adminFirstName"
                      type="text"
                      className={`${styles.input} ${
                        errors.adminFirstName ? styles['input-error'] : ''
                      }`}
                      value={adminFirstName}
                      onChange={(e) => onFieldChange('adminFirstName', e.target.value)}
                      autoComplete="given-name"
                    />
                    {errors.adminFirstName && (
                      <p className={styles['field-error']}>{errors.adminFirstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="adminLastName" className={styles.label}>
                      Last Name
                    </label>
                    <input
                      id="adminLastName"
                      type="text"
                      className={`${styles.input} ${
                        errors.adminLastName ? styles['input-error'] : ''
                      }`}
                      value={adminLastName}
                      onChange={(e) => onFieldChange('adminLastName', e.target.value)}
                      autoComplete="family-name"
                    />
                    {errors.adminLastName && (
                      <p className={styles['field-error']}>{errors.adminLastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="adminUsername" className={styles.label}>
                    Username
                  </label>
                  <div className={styles['input-with-icon']}>
                    <AtSign size={16} className={styles['input-icon']} aria-hidden />
                    <input
                      id="adminUsername"
                      type="text"
                      className={`${styles.input} ${styles['input-padded']} ${
                        errors.adminUsername ? styles['input-error'] : ''
                      }`}
                      placeholder="admin"
                      value={adminUsername}
                      onChange={(e) => onFieldChange('adminUsername', e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  {errors.adminUsername && (
                    <p className={styles['field-error']}>{errors.adminUsername}</p>
                  )}
                </div>

                <div className={styles['form-grid']}>
                  <div>
                    <label htmlFor="adminPassword" className={styles.label}>
                      Password
                    </label>
                    <div className={styles['input-with-toggle']}>
                      <input
                        id="adminPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={`${styles.input} ${styles['input-toggle-padded']} ${
                          errors.adminPassword ? styles['input-error'] : ''
                        }`}
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => onFieldChange('adminPassword', e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className={styles['password-toggle']}
                        onClick={onToggleShowPassword}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                    {errors.adminPassword && (
                      <p className={styles['field-error']}>{errors.adminPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="adminConfirmPassword" className={styles.label}>
                      Confirm Password
                    </label>
                    <div className={styles['input-with-toggle']}>
                      <input
                        id="adminConfirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`${styles.input} ${styles['input-toggle-padded']} ${
                          errors.adminConfirmPassword ? styles['input-error'] : ''
                        }`}
                        placeholder="••••••••"
                        value={adminConfirmPassword}
                        onChange={(e) => onFieldChange('adminConfirmPassword', e.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className={styles['password-toggle']}
                        onClick={onToggleShowConfirmPassword}
                        aria-label={
                          showConfirmPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                    {errors.adminConfirmPassword && (
                      <p className={styles['field-error']}>{errors.adminConfirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className={styles.callout}>
                  <Info size={16} className={styles['callout-icon']} aria-hidden />
                  <p className={styles['callout-text']}>
                    Password must be at least 8 characters and include a combination of letters
                    and numbers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={`${styles['step-content']} ${styles['step-content-active']}`}>
              <header className={styles['step-header-wide']}>
                <h2 className={styles['step-heading']}>Installing System</h2>
                <p className={styles['step-subheading']}>
                  Please do not close this window while we configure your environment.
                </p>
              </header>

              <div className={styles['install-panel']}>
                <ul className={styles['install-log']}>
                  {installTasks.map((task) => (
                    <li key={task.id} className={styles['install-row']}>
                      <span className={styles['install-icon']}>
                        {task.status === 'active' && (
                          <Loader2 size={16} className={styles.spin} aria-hidden />
                        )}
                        {task.status === 'done' && (
                          <Check size={16} className={styles['install-check']} aria-hidden />
                        )}
                        {task.status === 'pending' && (
                          <span className={styles['install-dot']} />
                        )}
                      </span>
                      <span
                        className={`${styles['install-label']} ${
                          task.status === 'active'
                            ? styles['install-label-active']
                            : task.status === 'done'
                              ? styles['install-label-done']
                              : ''
                        }`}
                      >
                        {task.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {step === 4 && (
            <div
              className={`${styles['step-content']} ${styles['step-content-active']} ${styles['success-panel']}`}
            >
              <div className={styles['success-icon-wrap']}>
                <Check size={32} className={styles['success-icon']} aria-hidden />
              </div>
              <h2 className={styles['step-heading']}>Installation Complete</h2>
              <p className={styles['success-text']}>
                Giftistry has been successfully configured and is ready to use. You can now log
                in with your administrator account.
              </p>
            </div>
          )}
        </div>
      </div>

      {showFooter && (
        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles['btn-back']} ${showFooterBack ? '' : styles.invisible}`}
            onClick={onPrev}
            disabled={!showFooterBack}
            tabIndex={showFooterBack ? 0 : -1}
          >
            <ArrowLeft size={16} aria-hidden />
            Back
          </button>

          {step === 4 ? (
            <button type="button" className={styles['btn-primary']} onClick={onFinish}>
              Go to Login
              <ArrowRight size={16} aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              className={styles['btn-continue']}
              onClick={onNext}
              disabled={isSubmitting}
            >
              {step === 2 ? (
                <>
                  Initialize System
                  <Zap size={16} aria-hidden />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={16} aria-hidden />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </main>
  </div>
);
