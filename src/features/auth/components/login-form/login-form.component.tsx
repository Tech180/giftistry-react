import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { authApi } from '../../api/auth.api';
import { LoginFormTemplate } from './login-form.html';
import { ApiUser } from '../../interfaces/api-user.interface';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Controls
  const [step, setStep] = useState<'credentials' | '2fa' | 'email-otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // 2FA state
  const [ticket, setTicket] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // Email Magic Link OTP state
  const [emailOtpToken, setEmailOtpToken] = useState('');

  // Account Switcher state
  const [switcherAccounts, setSwitcherAccounts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('giftistry-switcher-accounts');
      if (raw) {
        setSwitcherAccounts(JSON.parse(raw));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const saveAccountToSwitcher = (user: ApiUser) => {
    try {
      const raw = localStorage.getItem('giftistry-switcher-accounts');
      const list = raw ? JSON.parse(raw) : [];
      const exists = list.some((u: any) => u.Email === user.Email);
      if (!exists) {
        list.push({
          Email: user.Email,
          Username: user.Username,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Avatar: user.Avatar
        });
        localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(list));
        setSwitcherAccounts(list);
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleRemoveSwitcherAccount = (emailToRemove: string) => {
    const updated = switcherAccounts.filter(acc => acc.Email !== emailToRemove);
    localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(updated));
    setSwitcherAccounts(updated);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
       const res = await login(email, password);
      if (res && res.Require2FA) {
        setTicket(res.Ticket || '');
        if (res.Code) {
          setTotpCode(res.Code);
        }
        setStep('2fa');
      } else {
        if (res && res.User) {
          saveAccountToSwitcher(res.User);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!totpCode) {
      setLocalError('Please enter verification code.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await authApi.verify2faLogin(ticket, totpCode);
      if (res && res.Token) {
        localStorage.setItem('giftistry-token', res.Token);
      }
      if (res && res.User) {
        saveAccountToSwitcher(res.User);
        // Force reload session context
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOtpSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email) {
      setLocalError('Please enter your email to send a magic link.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      await authApi.ssoEmailOtp(email);
      setStep('email-otp');
      showToast('A login code has been sent to your email.');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to send login code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailOtpVerify = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!emailOtpToken) {
      setLocalError('Please enter the OTP verification code.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await authApi.ssoEmailVerify(email, emailOtpToken);
      if (res && res.Token) {
        localStorage.setItem('giftistry-token', res.Token);
      }
      if (res && res.User) {
        saveAccountToSwitcher(res.User);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid or expired login code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLocalError(null);
    setIsLoading(true);
    try {
      const optionsRes = await authApi.passkeyLoginOptions();
      if (!optionsRes || !optionsRes.options) {
        throw new Error('Failed to fetch passkey options from server.');
      }

      const { startAuthentication } = await import('@simplewebauthn/browser');
      const authResponse = await startAuthentication({ optionsJSON: optionsRes.options });

      const verifyRes = await authApi.passkeyLoginVerify(authResponse);
      if (verifyRes && verifyRes.Require2FA) {
        setTicket(verifyRes.Ticket || '');
        setStep('2fa');
      } else {
        if (verifyRes && verifyRes.Token) {
          localStorage.setItem('giftistry-token', verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Passkey authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitcherSelect = async (selectedEmail: string) => {
    // Fill the email and trigger passkey login automatically!
    setEmail(selectedEmail);
    setLocalError(null);
    setIsLoading(true);
    try {
      const optionsRes = await authApi.passkeyLoginOptions();
      if (!optionsRes || !optionsRes.options) {
        throw new Error('Failed to fetch passkey options from server.');
      }

      const { startAuthentication } = await import('@simplewebauthn/browser');
      const authResponse = await startAuthentication({ optionsJSON: optionsRes.options });

      const verifyRes = await authApi.passkeyLoginVerify(authResponse);
      if (verifyRes && verifyRes.Require2FA) {
        setTicket(verifyRes.Ticket || '');
        setStep('2fa');
      } else {
        if (verifyRes && verifyRes.Token) {
          localStorage.setItem('giftistry-token', verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Passkey authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    authApi.ssoGitHub();
  };

  const showToast = (msg: string) => {
    // Render simple alert overlay or fallback
    alert(msg);
  };

  return (
    <LoginFormTemplate
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      localError={localError}
      handleSubmit={handleSubmit}
      step={step}
      setStep={setStep}
      totpCode={totpCode}
      setTotpCode={setTotpCode}
      handleTotpSubmit={handleTotpSubmit}
      emailOtpToken={emailOtpToken}
      setEmailOtpToken={setEmailOtpToken}
      handleEmailOtpSend={handleEmailOtpSend}
      handleEmailOtpVerify={handleEmailOtpVerify}
      handlePasskeyLogin={handlePasskeyLogin}
      handleGitHubLogin={handleGitHubLogin}
      switcherAccounts={switcherAccounts}
      handleSwitcherSelect={handleSwitcherSelect}
      handleRemoveSwitcherAccount={handleRemoveSwitcherAccount}
    />
  );
};
