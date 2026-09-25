import { useEffect, useState, type SyntheticEvent } from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { camelcaseKeys } from 'shared/utils/api-case.util';
import { authApi } from '../api/auth.api';
import type { Passkey } from '../interfaces/passkey.interface';
import type { UseSecuritySettingsProps } from '../interfaces/use-security-settings-props.interface';
import type { UseSecuritySettingsResult } from '../interfaces/use-security-settings-result.interface';
import { webAuthnErrorMessage } from '../utils/webauthn-error-message.util';

export function useSecuritySettings({
  showToast,
  requireStrongPasswords,
  refreshUser,
  user,
}: UseSecuritySettingsProps): UseSecuritySettingsResult {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [twoFactorStep, setTwoFactorStep] = useState<'none' | 'setup' | 'disable'>('none');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);

  const is2faEnabled = !!user?.TwoFactorEnabled;

  const fetchPasskeys = async () => {
    try {
      const res = await authApi.getPasskeys();
      if (res?.Passkeys) {
        setPasskeys(res.Passkeys);
      }
    } catch (err) {
      console.error('Failed to load passkeys:', err);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const handleUpdatePassword = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (requireStrongPasswords) {
      if (newPassword.length < 8) {
        showToast('New password must be at least 8 characters long.', 'error');
        return;
      }
      if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        showToast('Password must include at least one letter and one number.', 'error');
        return;
      }
    } else if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    if (currentPassword === newPassword) {
      showToast('New password must be different from the current password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      await refreshUser();
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup2FA = async (): Promise<boolean> => {
    try {
      const res = await authApi.setup2fa();
      if (res?.Secret) {
        setTotpSecret(res.Secret);
        setQrCodeUrl(res.QrCodeUrl);
        setRecoveryCodes([]);
        setTwoFactorStep('setup');
        return true;
      }
      return false;
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to retrieve 2FA setup options', 'error');
      return false;
    }
  };

  const readOtpFromForm = (form: HTMLFormElement) =>
    String(new FormData(form).get('otp') ?? '').replace(/\D/g, '');

  const handleEnable2FA = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = readOtpFromForm(e.currentTarget);
    if (!code) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }

    try {
      const res = await authApi.enable2fa(totpSecret, code);
      await refreshUser();
      showToast('Two-Factor Authentication enabled successfully!', 'success');
      if (res.RecoveryCodes && res.RecoveryCodes.length > 0) {
        setRecoveryCodes(res.RecoveryCodes);
      } else {
        setTwoFactorStep('none');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Invalid code. Verification failed.', 'error');
    }
  };

  const handleDisable2FA = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = readOtpFromForm(e.currentTarget);
    if (!code) {
      showToast('Please enter the 6-digit verification code.', 'error');
      return;
    }

    try {
      await authApi.disable2fa(code);
      await refreshUser();
      showToast('Two-Factor Authentication has been disabled.', 'info');
      setTwoFactorStep('none');
      setRecoveryCodes([]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Invalid code. Disable failed.', 'error');
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      const res = await authApi.passkeyRegisterOptions();
      if (!res?.Options) {
        throw new Error('Failed to retrieve passkey options from server.');
      }

      let regResponse;
      try {
        regResponse = await startRegistration({ optionsJSON: camelcaseKeys(res.Options) });
      } catch (webAuthnErr) {
        const message = webAuthnErrorMessage(webAuthnErr);
        if (message) {
          showToast(message, 'error');
        }
        return;
      }

      try {
        await authApi.passkeyRegisterVerify(regResponse);
        showToast('Passkey registered successfully! You can now use it to sign in.', 'success');
        await fetchPasskeys();
      } catch (serverErr) {
        showToast(serverErr instanceof Error ? serverErr.message : 'Server failed to verify passkey.', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to retrieve passkey options.', 'error');
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      await authApi.deletePasskey(passkeyId);
      showToast('Passkey deleted successfully.', 'success');
      setDeletingPasskeyId(null);
      await fetchPasskeys();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete passkey.', 'error');
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
    handleUpdatePassword,
    is2faEnabled,
    twoFactorStep,
    setTwoFactorStep,
    qrCodeUrl,
    totpSecret,
    accountUsername: user?.Email || user?.Username || '',
    handleSetup2FA,
    handleEnable2FA,
    handleDisable2FA,
    recoveryCodes,
    setRecoveryCodes,
    showToast,
    handleRegisterPasskey,
    passkeys,
    handleDeletePasskey,
    deletingPasskeyId,
    setDeletingPasskeyId,
  };
}
