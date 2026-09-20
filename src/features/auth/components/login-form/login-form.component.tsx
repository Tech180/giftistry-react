import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../providers';
import { useToast } from 'shared/providers/toast';
import { AUTH_TOKEN_STORAGE_KEY } from 'core/api/constants/token-storage-key.constant';
import { authApi } from '../../api/auth.api';
import { LoginFormTemplate } from './login-form.html';
import { ApiUser } from '../../interfaces/api-user.interface';
import { postAuthPath } from '../../utils/post-auth-path.util';
import { camelcaseKeys } from 'shared/utils/api-case.util';
import type { LocationState } from './interfaces/location-state.interface';
import type { Step } from './interfaces/step.type';
import type { SwitcherAccount } from './interfaces/switcher-account.interface';
import { readSwitcherAccounts } from './utils/read-switcher-accounts.util';
import { writeSwitcherAccounts } from './utils/write-switcher-accounts.util';

export const LoginForm: React.FC = () => {
  const {
    login,
    refreshUser,
    allowPasswordLogin,
    oauthEnabled,
    oauthButtonText,
    registrationMode,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<Step>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [ticket, setTicket] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [switcherAccounts, setSwitcherAccounts] = useState<SwitcherAccount[]>([]);

  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const cancelBiometrics = () => {
    setIsBiometricModalOpen(false);
  };

  useEffect(() => {
    const state = location.state as LocationState | null;
    const errorFromInvite = state?.error?.trim();
    if (!errorFromInvite) {
      return;
    }

    setLocalError(errorFromInvite);
    navigate(location.pathname + location.search, { replace: true, state: {} });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    const loadAndVerifyAccounts = async () => {
      try {
        const accounts = readSwitcherAccounts().filter((acc) => acc.Username);
        if (accounts.length === 0) {
          return;
        }

        const initialShow = accounts.filter((acc) => acc.HasPasskey !== false);
        setSwitcherAccounts(initialShow);

        let updated = false;
        const checkedAccounts = await Promise.all(
          accounts.map(async (acc) => {
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
          }),
        );

        if (updated) {
          writeSwitcherAccounts(checkedAccounts);
          setSwitcherAccounts(checkedAccounts.filter((acc) => acc.HasPasskey !== false));
        }
      } catch {
        // Ignore
      }
    };

    void loadAndVerifyAccounts();
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      return;
    }

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    refreshUser()
      .then(async () => {
        setSearchParams({}, { replace: true });
        const me = await authApi.getMe();
        navigate(postAuthPath(me?.User), { replace: true });
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
      const list = readSwitcherAccounts();
      const index = list.findIndex((u) => u.Username === user.Username);
      const accountData: SwitcherAccount = {
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

      writeSwitcherAccounts(list);
      setSwitcherAccounts(list.filter((acc) => acc.HasPasskey !== false));
    } catch {
      // Ignore
    }
  };

  const handleRemoveSwitcherAccount = (usernameToRemove: string) => {
    try {
      const list = readSwitcherAccounts();
      const updated = list.filter((acc) => acc.Username !== usernameToRemove);
      writeSwitcherAccounts(updated);
      setSwitcherAccounts(updated.filter((acc) => acc.HasPasskey !== false));
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
        navigate(postAuthPath(res?.User));
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
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.Token);
      }
      if (res && res.User) {
        saveAccountToSwitcher(res.User);
        showToast('Authentication successful!');
        window.location.href = postAuthPath(res.User);
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
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          showToast('Passkey verified successfully!');
          window.location.href = postAuthPath(verifyRes.User);
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
          const list = readSwitcherAccounts();
          const idx = list.findIndex((u) => u.Username === selectedUsername);
          if (idx > -1) {
            list[idx] = { ...list[idx]!, HasPasskey: hasPasskey };
            writeSwitcherAccounts(list);
            setSwitcherAccounts(list.filter((acc) => acc.HasPasskey !== false));
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
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, verifyRes.Token);
        }
        if (verifyRes && verifyRes.User) {
          saveAccountToSwitcher(verifyRes.User);
          showToast('Passkey verified successfully!');
          window.location.href = postAuthPath(verifyRes.User);
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
      username = {
        username
      }
      setUsername = {
        setUsername
      }
      password = {
        password
      }
      setPassword = {
        setPassword
      }
      isLoading = {
        isLoading
      }
      localError = {
        localError
      }
      handleSubmit = {
        handleSubmit
      }
      step = {
        step
      }
      setStep = {
        setStep
      }
      totpCode = {
        totpCode
      }
      setTotpCode = {
        setTotpCode
      }
      handleTotpSubmit = {
        handleTotpSubmit
      }
      handlePasskeyLogin = {
        handlePasskeyLogin
      }
      switcherAccounts = {
        switcherAccounts
      }
      handleSwitcherSelect = {
        handleSwitcherSelect
      }
      handleRemoveSwitcherAccount = {
        handleRemoveSwitcherAccount
      }
      isBiometricModalOpen = {
        isBiometricModalOpen
      }
      biometricLabel = {
        biometricLabel
      }
      cancelBiometrics = {
        cancelBiometrics
      }
      allowPasswordLogin = {
        allowPasswordLogin
      }
      oauthEnabled = {
        oauthEnabled
      }
      oauthButtonText = {
        oauthButtonText
      }
      handleOauthLogin = {
        () => authApi.beginOauthLogin()
      }
      showRegisterLink = {
        registrationMode === 'open'
      }
      showPassword = {
        showPassword
      }
      onToggleShowPassword = {
        () => setShowPassword((prev) => !prev)
      }
    />
  );
};
