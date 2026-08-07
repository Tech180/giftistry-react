import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { authApi } from '../../api/auth.api';
import { postAuthPath } from '../../utils/post-auth-path.util';
import { ChangePasswordFormTemplate } from './change-password-form.html';

export const ChangePasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser, requireStrongPasswords } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const passwordHint = requireStrongPasswords
    ? 'Password must be at least 8 characters and include at least one letter and one number.'
    : 'Password must be at least 6 characters.';

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setLocalError('Please fill in all password fields.');
      return;
    }

    if (requireStrongPasswords) {
      if (newPassword.length < 8) {
        setLocalError('Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        setLocalError('Password must include at least one letter and one number.');
        return;
      }
    } else if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('New password and confirmation do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setLocalError('New password must be different from the current password.');
      return;
    }

    setLocalError(null);
    setIsLoading(true);

    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      await refreshUser();
      navigate(postAuthPath(res?.User), { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChangePasswordFormTemplate
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      showCurrent={showCurrent}
      showNew={showNew}
      showConfirm={showConfirm}
      onToggleShowCurrent={() => setShowCurrent((prev) => !prev)}
      onToggleShowNew={() => setShowNew((prev) => !prev)}
      onToggleShowConfirm={() => setShowConfirm((prev) => !prev)}
      isLoading={isLoading}
      localError={localError}
      handleSubmit={handleSubmit}
      passwordHint={passwordHint}
    />
  );
};
