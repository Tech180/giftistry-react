import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, AlertCircle, ShieldCheck, ArrowLeft, Fingerprint, UserCheck, X, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { Input, Button, Card, EnterPanel } from 'shared/ui';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { LoginFormTemplateProps } from '../../interfaces/login-form-template-props.interface';
import styles from './login-form.module.css';

export const LoginFormTemplate: React.FC<LoginFormTemplateProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  isLoading,
  localError,
  handleSubmit,
  step,
  setStep,
  totpCode,
  setTotpCode,
  handleTotpSubmit,
  handlePasskeyLogin,
  switcherAccounts,
  handleSwitcherSelect,
  handleRemoveSwitcherAccount,
  isBiometricModalOpen,
  biometricLabel,
  cancelBiometrics,
  allowPasswordLogin,
  oauthEnabled,
  oauthButtonText,
  handleOauthLogin,
  showPassword,
  onToggleShowPassword,
}) => {
  return (
    <div className={styles['page-wrapper-outer']}>
      {/* Background decorative spotlight and noise overlay scoped to login wrapper */}
      <div className={styles['background-glow-container']}>
        <div className={styles['ambient-glow']} />
        <div className={styles['noise-overlay']} />
      </div>

      <div className={styles['page-wrapper']}>
        <EnterPanel animation="scale">
          <Card className={styles['login-card']} padding="lg" glass={true}>
            {/* Dynamic Loading Progress Bar */}
            <div
              className={`${styles['loading-progress']} ${
                isLoading ? styles['loading-active'] : ''
              }`}
            />

            {localError && (
              <EnterPanel animation="slide-up" className={styles.alert}>
                <AlertCircle size={16} />
                <span>{localError}</span>
              </EnterPanel>
            )}

            {step === 'credentials' && (
              <>
                <div className={styles.header}>
                  <h2 className={styles.title}>Welcome Back</h2>
                  <p className={styles.subtitle}>Sign in to your Giftistry account</p>
                </div>

                {/* Horizontal Switcher Accounts (Recent Accounts) */}
                {switcherAccounts.length > 0 && (
                  <div className={styles['quick-access-section']}>
                    <div className={styles['quick-access-header']}>
                      <span className={styles['quick-access-title']}>Recent Accounts</span>
                    </div>

                    <div className={styles['switcher-horizontal-list']}>
                      {switcherAccounts.map((acc) => (
                        <div key={acc.Username} className={styles['switcher-horizontal-item']}>
                          {/* Remove button */}
                          <button
                            type="button"
                            className={styles['remove-badge-btn']}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSwitcherAccount(acc.Username);
                            }}
                          >
                            <X size={10} />
                          </button>

                          <div
                            className={styles['avatar-container']}
                            onClick={() => handleSwitcherSelect(acc.Username)}
                          >
                            <UserAvatar
                              avatar={acc.Avatar}
                              alt={acc.Username}
                              initials={(acc.FirstName ? acc.FirstName[0] : acc.Username[0]).toUpperCase()}
                              className={styles['switcher-avatar']}
                              imageClassName={styles['switcher-avatar-img']}
                            />
                            
                            {/* Fingerprint icon overlay on hover */}
                            {acc.HasPasskey !== false && (
                              <div className={styles['avatar-fingerprint-overlay']}>
                                <Fingerprint size={16} />
                              </div>
                            )}
                          </div>

                          <div
                            className={styles['switcher-info-container']}
                            onClick={() => handleSwitcherSelect(acc.Username)}
                          >
                            <span className={styles['switcher-name-label']}>
                              {acc.FirstName ? `${acc.FirstName} ${acc.LastName ? acc.LastName[0] : ''}.` : acc.Username}
                            </span>
                            <span className={styles['switcher-role-label']}>
                              @{acc.Username}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className={styles.divider}>
                      <span className={styles['divider-line']} />
                      <span className={styles['divider-text']}>or log in with username</span>
                      <span className={styles['divider-line']} />
                    </div>
                  </div>
                )}

                {oauthEnabled && (
                  <div className={styles['alt-actions']}>
                    <Button
                      onClick={handleOauthLogin}
                      variant="secondary"
                      className={styles['full-width-btn']}
                      type="button"
                    >
                      {oauthButtonText}
                    </Button>
                  </div>
                )}

                {allowPasswordLogin ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <Input
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="yourusername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    leftIcon={<UserIcon size={16} />}
                    required
                  />

                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock size={16} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={onToggleShowPassword}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    }
                    rightIconClickable
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className={styles['submit-btn']}
                  >
                    Continue
                  </Button>
                </form>
                ) : (
                  !oauthEnabled && (
                    <div className={styles.alert}>
                      Password login is disabled on this server.
                    </div>
                  )
                )}

                {allowPasswordLogin && switcherAccounts.length === 0 && (
                  <>
                    <div className={styles.divider}>
                      <span className={styles['divider-line']} />
                      <span className={styles['divider-text']}>OR</span>
                      <span className={styles['divider-line']} />
                    </div>

                    <div className={styles['alt-actions']}>
                      <Button
                        onClick={handlePasskeyLogin}
                        variant="secondary"
                        className={styles['full-width-btn']}
                      >
                        <Fingerprint size={16} /> Sign In with Passkey
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {step === '2fa' && (
              <div className={styles['step-2fa-container']}>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className={styles['back-btn-absolute']}
                >
                  <ArrowLeft size={18} />
                </button>

                <div className={styles['header-2fa']}>
                  <div className={styles['shield-icon-container']}>
                    <ShieldCheck size={20} className={styles['shield-icon']} />
                  </div>
                  <h2 className={styles['title-2fa']}>Two-step verification</h2>
                  <p className={styles['subtitle-2fa']}>Enter the code from your authenticator app.</p>
                </div>

                <form onSubmit={handleTotpSubmit} className={styles.form}>
                  <Input
                    label="Authentication Code"
                    type="text"
                    id="totp"
                    name="totp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={10}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.trim())}
                    leftIcon={<Lock size={16} />}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className={styles['submit-btn']}
                  >
                    Verify
                  </Button>
                </form>
              </div>
            )}

            <div className={styles.footer}>
              <span>New to Giftistry?</span>{' '}
              <Link to="/register" className={styles.link}>
                Create an account
              </Link>
            </div>
          </Card>
        </EnterPanel>
      </div>

      {/* Biometric WebAuthn Modal Overlay */}
      {isBiometricModalOpen && (
        <div className={styles['biometric-overlay']}>
          <div className={styles['biometric-modal']}>
            <div className={styles['biometric-icon-container']}>
              <Fingerprint size={36} className={styles['biometric-fingerprint-icon']} />
              <div className={styles['biometric-radar-ring']} />
              <div className={styles['biometric-pulse-bg']} />
            </div>

            <h3 className={styles['biometric-title']}>Verify Identity</h3>
            <p className={styles['biometric-desc']}>
              Use Windows Hello, Touch ID, security keys, or password managers to sign in securely.
            </p>

            <div className={styles['biometric-user-badge']}>
              <div className={styles['badge-user-icon-container']}>
                <UserCheck size={14} className={styles['badge-user-icon']} />
              </div>
              <span className={styles['badge-email-label']}>{biometricLabel}</span>
            </div>

            <button
              type="button"
              onClick={cancelBiometrics}
              className={styles['biometric-cancel-btn']}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
