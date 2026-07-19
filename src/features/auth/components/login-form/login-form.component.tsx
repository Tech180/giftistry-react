import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { authApi } from '../../api/auth.api';
import { LoginFormTemplate } from './login-form.html';
import { ApiUser } from '../../interfaces/api-user.interface';
import { camelcaseKeys } from 'shared/utils/api-case.util';

export const LoginForm: React.FC = () => {
  const { login, refreshUser, allowPasswordLogin, oauthEnabled, oauthButtonText } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [ticket, setTicket] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [switcherAccounts, setSwitcherAccounts] = useState<any[]>([]);

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cancelBiometrics = () => {
    setIsBiometricModalOpen(false);
  };

  useEffect(() => {
    const loadAndVerifyAccounts = async () => {
      try {
        const raw = localStorage.getItem('giftistry-switcher-accounts');
        if (!raw) return;

        const accounts = JSON.parse(raw).map((acc: any) => ({
          ...acc,
          Username: acc.Username || acc.Email,
        }));

        const initialShow = accounts.filter((acc: any) => acc.HasPasskey !== false);
        setSwitcherAccounts(initialShow);

        let updated = false;
        const checkedAccounts = await Promise.all(
          accounts.map(async (acc: any) => {
            if (acc.HasPasskey === undefined && acc.Username) {
              try {
                const res = await authApi.checkPasskey(acc.Username);
                updated = true;
                return { ...acc, HasPasskey: !!(res && res.HasPasskey) };
              } catch {
                return acc;
              }
            }
            return acc;
          })
        );

        if (updated) {
          localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(checkedAccounts));
          const finalShow = checkedAccounts.filter((acc: any) => acc.HasPasskey !== false);
          setSwitcherAccounts(finalShow);
        }
      } catch {
        // Ignore
      }
    };

    loadAndVerifyAccounts();
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) return;

    localStorage.setItem('giftistry-token', token);
    refreshUser()
      .then(async () => {
        setSearchParams({}, { replace: true });
        const me = await authApi.getMe();
        navigate(me?.User?.IsOnboarded === false ? '/welcome' : '/dashboard', { replace: true });
      })
      .catch(() => {
        setLocalError('OAuth sign-in failed. Please try again.');
      });
  }, [searchParams, setSearchParams, refreshUser, navigate]);

  useEffect(() => {
    if (oauthEnabled && searchParams.get('oauth') === 'auto') {
      authApi.beginOauthLogin();
    }
  }, [oauthEnabled, searchParams]);

  const saveAccountToSwitcher = (user: ApiUser) => {
    try {
      const raw = localStorage.getItem('giftistry-switcher-accounts');
      const list = raw ? JSON.parse(raw) : [];
      const index = list.findIndex((u: any) => u.Username === user.Username);
      const accountData = {
        Username: user.Username,
        Email: user.Email,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Avatar: user.Avatar,
        HasPasskey: user.HasPasskey,
      };

      if (index > -1) {
        list[index] = accountData;
      } else {
        list.push(accountData);
      }

      localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(list));
      setSwitcherAccounts(list.filter((acc: any) => acc.HasPasskey !== false));
    } catch {
      // Ignore
    }
  };

  const handleRemoveSwitcherAccount = (usernameToRemove: string) => {
    try {
      const raw = localStorage.getItem('giftistry-switcher-accounts');
      if (raw) {
        const list = JSON.parse(raw);
        const updated = list.filter((acc: any) => acc.Username !== usernameToRemove);
        localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(updated));
        setSwitcherAccounts(updated.filter((acc: any) => acc.HasPasskey !== false));
      }
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLocalError('Please enter both username and password.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await login(username, password);
      if (res && res.Require2FA) {
        setTicket(res.Ticket || '');
        setStep('2fa');
      } else {
        if (res && res.User) {
          saveAccountToSwitcher(res.User);
        }
        showToast('Login successful!');
        navigate(res?.User?.IsOnboarded === false ? '/welcome' : '/dashboard');
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
        showToast('Authentication successful!');
        window.location.href = res.User.IsOnboarded === false ? '/welcome' : '/dashboard';
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLocalError(null);
    setIsLoading(true);
    setBiometricLabel(username || 'Secure Sign In');
    setIsBiometricModalOpen(true);
    try {
      const optionsRes = await authApi.passkeyLoginOptions();
      if (!optionsRes || !optionsRes.Options) {
        throw new Error('Failed to fetch passkey options from server.');
      }

      const { startAuthentication } = await import('@simplewebauthn/browser');
      const authResponse = await startAuthentication({ optionsJSON: camelcaseKeys(optionsRes.Options) });

      const verifyRes = await authApi.passkeyLoginVerify(authResponse);
      setIsBiometricModalOpen(false);
      if (verifyRes && verifyRes.Require2FA) {
        setTicket(verifyRes.Ticket || '');
        setStep('2fa');
      } else {
        if (verifyRes && verifyRes.Token) {
          localStorage.setItem('giftistry-token', verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          showToast('Passkey verified successfully!');
          window.location.href = verifyRes.User.IsOnboarded === false ? '/welcome' : '/dashboard';
        }
      }
    } catch (err) {
      setIsBiometricModalOpen(false);
      setLocalError(err instanceof Error ? err.message : 'Passkey authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitcherSelect = async (selectedUsername: string) => {
    setUsername(selectedUsername);
    setLocalError(null);
    setIsLoading(true);

    try {
      const localAcc = switcherAccounts.find((acc) => acc.Username === selectedUsername);
      let hasPasskey = localAcc?.HasPasskey;

      if (hasPasskey === undefined) {
        const checkRes = await authApi.checkPasskey(selectedUsername);
        hasPasskey = !!(checkRes && checkRes.HasPasskey);

        try {
          const raw = localStorage.getItem('giftistry-switcher-accounts');
          if (raw) {
            const list = JSON.parse(raw);
            const idx = list.findIndex((u: any) => u.Username === selectedUsername);
            if (idx > -1) {
              list[idx].HasPasskey = hasPasskey;
              localStorage.setItem('giftistry-switcher-accounts', JSON.stringify(list));
              setSwitcherAccounts(list);
            }
          }
        } catch {
          // Ignore
        }
      }

      if (!hasPasskey) {
        setLocalError('Please sign in using your password.');
        setIsLoading(false);
        return;
      }

      setBiometricLabel(selectedUsername);
      setIsBiometricModalOpen(true);

      const optionsRes = await authApi.passkeyLoginOptions();
      if (!optionsRes || !optionsRes.Options) {
        throw new Error('Failed to fetch passkey options from server.');
      }

      const { startAuthentication } = await import('@simplewebauthn/browser');
      const authResponse = await startAuthentication({ optionsJSON: camelcaseKeys(optionsRes.Options) });

      const verifyRes = await authApi.passkeyLoginVerify(authResponse);
      setIsBiometricModalOpen(false);
      if (verifyRes && verifyRes.Require2FA) {
        setTicket(verifyRes.Ticket || '');
        setStep('2fa');
      } else {
        if (verifyRes && verifyRes.Token) {
          localStorage.setItem('giftistry-token', verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          showToast('Passkey verified successfully!');
          window.location.href = verifyRes.User.IsOnboarded === false ? '/welcome' : '/dashboard';
        }
      }
    } catch (err) {
      setIsBiometricModalOpen(false);
      setLocalError(err instanceof Error ? err.message : 'Passkey authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginFormTemplate
      username={username}
      setUsername={setUsername}
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
      handlePasskeyLogin={handlePasskeyLogin}
      switcherAccounts={switcherAccounts}
      handleSwitcherSelect={handleSwitcherSelect}
      handleRemoveSwitcherAccount={handleRemoveSwitcherAccount}
      isBiometricModalOpen={isBiometricModalOpen}
      biometricLabel={biometricLabel}
      cancelBiometrics={cancelBiometrics}
      allowPasswordLogin={allowPasswordLogin}
      oauthEnabled={oauthEnabled}
      oauthButtonText={oauthButtonText}
      handleOauthLogin={() => authApi.beginOauthLogin()}
      showPassword={showPassword}
      onToggleShowPassword={() => setShowPassword((prev) => !prev)}
    />
  );
};
