import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Shield, ArrowLeft, Trash2, Fingerprint, UserCheck } from 'lucide-react';
import { Input, Button, Card, EnterPanel } from 'shared/ui';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { LoginFormTemplateProps } from '../../interfaces/login-form-template-props.interface';
import styles from './login-form.module.css';

export const LoginFormTemplate: React.FC<LoginFormTemplateProps> = ({
  email,
  setEmail,
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
}) => {
  return (
    <div className={styles['page-wrapper']}>
      <EnterPanel animation="scale">
        <Card className={styles['login-card']} padding="lg" glass={true}>
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

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Email Address"
                type="email"
                id="email"
                name="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
              />

              <Input
                label="Password"
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className={styles['submit-btn']}
              >
                Sign In
              </Button>
            </form>

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

        {step === '2fa' && (
          <>
            <div className={styles.header}>
              <h2 className={`${styles.title} ${styles['title-with-icon']}`}>
                <Shield size={24} className={styles['title-icon']} /> Two-Factor Verification
              </h2>
              <p className={styles.subtitle}>Enter the 6-digit code from your app or a recovery code</p>
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
                placeholder="123456 or Recovery Code"
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
                Verify Code
              </Button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className={styles['back-btn']}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </form>
          </>
        )}

        <div className={styles.footer}>
          <span>Don't have an account?</span>{' '}
          <Link to="/register" className={styles.link}>
            Sign up
          </Link>
        </div>
      </Card>
      </EnterPanel>

      {step === 'credentials' && switcherAccounts.length > 0 && (
        <Card glass={true} padding="md" className={styles['switcher-card']}>
          <div className={styles['switcher-header']}>
            <UserCheck size={18} className={styles['switcher-header-icon']} />
            <h3 className={styles['switcher-title']}>Quick Sign-In</h3>
          </div>
          <div className={styles['switcher-list']}>
            {switcherAccounts.map((acc) => (
              <div key={acc.Email} className={styles['switcher-item']}>
                <div
                  onClick={() => handleSwitcherSelect(acc.Email)}
                  className={styles['switcher-item-main']}
                >
                  <UserAvatar
                    avatar={acc.Avatar}
                    alt={acc.Username}
                    initials={(acc.FirstName ? acc.FirstName[0] : acc.Username[0]).toUpperCase()}
                    className={styles['switcher-avatar']}
                    imageClassName={styles['switcher-avatar-img']}
                  />
                  <div className={styles['switcher-info']}>
                    <div className={styles['switcher-name']}>{acc.FirstName ? `${acc.FirstName} ${acc.LastName}` : acc.Username}</div>
                    <div className={styles['switcher-email']}>{acc.Email}</div>
                  </div>
                </div>

                <div className={styles['switcher-actions']}>
                  <button
                    onClick={() => handleSwitcherSelect(acc.Email)}
                    className={styles['passkey-btn']}
                  >
                    Passkey
                  </button>
                  <button
                    onClick={() => handleRemoveSwitcherAccount(acc.Email)}
                    className={styles['remove-btn']}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
