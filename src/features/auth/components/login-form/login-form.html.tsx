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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '420px', margin: '40px auto' }}>
      
      {/* Main Login Card */}
      <Card className={`${styles.loginCard} animate-scale-in`} padding="lg" glass={true} style={{ margin: 0 }}>
        {localError && (
          <div className={`${styles.alert} animate-slide-up`}>
            <AlertCircle size={16} />
            <span>{localError}</span>
          </div>
        )}

        {/* STEP 1: Credentials Form */}
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

            <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR</span>
              <span style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                onClick={handlePasskeyLogin}
                variant="secondary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Fingerprint size={16} /> Sign In with Passkey
              </Button>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  onClick={handleGitHubLogin}
                  variant="secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg> GitHub
                </Button>

                <Button
                  onClick={handleEmailOtpSend}
                  variant="secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Mail size={16} /> Magic Link
                </Button>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: TOTP Verification Form */}
        {step === '2fa' && (
          <>
            <div className={styles.header}>
              <h2 className={styles.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Shield size={24} style={{ color: 'var(--primary)' }} /> Two-Factor Verification
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </form>
          </>
        )}

        {/* STEP 3: Email OTP Verification Form */}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
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

      {/* Account Switcher Widget */}
      {step === 'credentials' && switcherAccounts.length > 0 && (
        <Card glass={true} padding="md" style={{ border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <UserCheck size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Quick Sign-In</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {switcherAccounts.map((acc) => (
              <div
                key={acc.Email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'background-color 0.2s'
                }}
              >
                <div
                  onClick={() => handleSwitcherSelect(acc.Email)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    color: '#fff',
                    fontSize: '14px'
                  }}>
                    {acc.Avatar ? (
                      <img src={acc.Avatar} alt={acc.Username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      (acc.FirstName ? acc.FirstName[0] : acc.Username[0]).toUpperCase()
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{acc.FirstName ? `${acc.FirstName} ${acc.LastName}` : acc.Username}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{acc.Email}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleSwitcherSelect(acc.Email)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'rgba(255, 0, 255, 0.1)',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Passkey
                  </button>
                  <button
                    onClick={() => handleRemoveSwitcherAccount(acc.Email)}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
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
