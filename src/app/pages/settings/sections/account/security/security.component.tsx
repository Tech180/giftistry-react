import React from 'react';
import { useAuth } from 'features/auth';
import { useSecuritySettings } from 'features/auth';
import { SecurityTemplate } from './security.html';
import { SecurityProps } from './interfaces/props.interface';

export const Security: React.FC<SecurityProps> = ({ showToast }) => {
  const { user, refreshUser, requireStrongPasswords } = useAuth();
  const security = useSecuritySettings({
    showToast,
    requireStrongPasswords,
    refreshUser,
    user,
  });

  return <SecurityTemplate {...security} />;
};

export default Security;
