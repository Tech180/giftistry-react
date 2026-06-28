import React, { useState } from 'react';
import { SecurityTabTemplate } from './security-tab.html';

interface SecurityTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ showToast }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setIsLoading(true);
    // Simulate API update
    setTimeout(() => {
      setIsLoading(false);
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <SecurityTabTemplate
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      showCurrent={showCurrent}
      setShowCurrent={setShowCurrent}
      showNew={showNew}
      setShowNew={setShowNew}
      showConfirm={showConfirm}
      setShowConfirm={setShowConfirm}
      handleUpdatePassword={handleUpdatePassword}
    />
  );
};
export default SecurityTab;
