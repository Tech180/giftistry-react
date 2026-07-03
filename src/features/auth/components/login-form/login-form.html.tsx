import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Shield, ArrowLeft, Trash2, Fingerprint, UserCheck } from 'lucide-react';
import { Input, Button, Card } from 'shared/ui';
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

  // 2FA step
  step,
  setStep,
  totpCode,
  setTotpCode,
  handleTotpSubmit,

  // Email Magic Link OTP step
  emailOtpToken,
  setEmailOtpToken,
  handleEmailOtpSend,
  handleEmailOtpVerify,

  // Passwordless & SSO
  handlePasskeyLogin,
  handleGitHubLogin,

  // Account Switcher
  switcherAccounts,
  handleSwitcherSelect,
  handleRemoveSwitcherAccount,
}) => {
  return (
    <div className={styles.pageWrapper}>
      <Card className={`${styles.loginCard} animate-scale-in`} padding="lg" glass={true}>
        {localError && (
          <div className={`${styles.alert} animate-slide-up`}>
            <AlertCircle size={16} />
            <span>{localError}</span>
          </div>
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
                className={styles.submitBtn}
              >
                Sign In
              </Button>
            </form>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <span className={styles.dividerLine} />
            </div>

            <div className={styles.altActions}>
              <Button
                onClick={handlePasskeyLogin}
                variant="secondary"
                className={styles.fullWidthBtn}
              >
                <Fingerprint size={16} /> Sign In with Passkey
              </Button>

              <div className={styles.splitActions}>
                <Button
                  onClick={handleGitHubLogin}
                  variant="secondary"
                  className={styles.flexBtn}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={styles.githubIcon}>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg> GitHub
                </Button>

                <Button
                  onClick={handleEmailOtpSend}
                  variant="secondary"
                  className={styles.flexBtn}
                >
                  <Mail size={16} /> Magic Link
                </Button>
              </div>
            </div>
          </>
        )}

        {step === '2fa' && (
          <>
            <div className={styles.header}>
              <h2 className={`${styles.title} ${styles.titleWithIcon}`}>
                <Shield size={24} className={styles.titleIcon} /> Two-Factor Verification
              </h2>
              <p className={styles.subtitle}>Enter the 6-digit code from your app or a recovery code</p>
            </div>

            <form onSubmit={handleTotpSubmit} className={styles.form}>
              <Input
                label="Authentication Code"
                type="text"
                id="2fa-code"
                name="code"
                autoComplete="one-time-code"
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
                className={styles.submitBtn}
              >
                Verify Code
              </Button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className={styles.backBtn}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </form>
          </>
        )}

        {step === 'email-otp' && (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Verify Login Code</h2>
              <p className={styles.subtitle}>We sent a verification code to {email}</p>
            </div>

            <form onSubmit={handleEmailOtpVerify} className={styles.form}>
              <Input
                label="Verification Code"
                type="text"
                id="email-otp-code"
                name="emailOtpToken"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={emailOtpToken}
                onChange={(e) => setEmailOtpToken(e.target.value.replace(/\D/g, ''))}
                leftIcon={<Lock size={16} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className={styles.submitBtn}
              >
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => setStep('credentials')}
                className={styles.backBtn}
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

      {step === 'credentials' && switcherAccounts.length > 0 && (
        <Card glass={true} padding="md" className={styles.switcherCard}>
          <div className={styles.switcherHeader}>
            <UserCheck size={18} className={styles.switcherHeaderIcon} />
            <h3 className={styles.switcherTitle}>Quick Sign-In</h3>
          </div>
          <div className={styles.switcherList}>
            {switcherAccounts.map((acc) => (
              <div key={acc.Email} className={styles.switcherItem}>
                <div
                  onClick={() => handleSwitcherSelect(acc.Email)}
                  className={styles.switcherItemMain}
                >
                  <div className={styles.switcherAvatar}>
                    {acc.Avatar ? (
                      <img src={acc.Avatar} alt={acc.Username} className={styles.switcherAvatarImg} />
                    ) : (
                      (acc.FirstName ? acc.FirstName[0] : acc.Username[0]).toUpperCase()
                    )}
                  </div>
                  <div className={styles.switcherInfo}>
                    <div className={styles.switcherName}>{acc.FirstName ? `${acc.FirstName} ${acc.LastName}` : acc.Username}</div>
                    <div className={styles.switcherEmail}>{acc.Email}</div>
                  </div>
                </div>

                <div className={styles.switcherActions}>
                  <button
                    onClick={() => handleSwitcherSelect(acc.Email)}
                    className={styles.passkeyBtn}
                  >
                    Passkey
                  </button>
                  <button
                    onClick={() => handleRemoveSwitcherAccount(acc.Email)}
                    className={styles.removeBtn}
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
