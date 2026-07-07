import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'app/providers/auth-context';
import { adminApi, DEFAULT_USER_POLICY } from 'features/admin';
import type { AdminUser, AuditLogEntry, GiftistryUserPolicy } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminUserDetailTabTemplate } from './admin-user-detail-tab.html';
import type {
  AdminUserDetailTabKey,
  AdminUserPolicyFlagsState,
  AdminUserProfileFormState,
} from './interfaces/admin-user-detail-tab-template-props.interface';

export const AdminUserDetailTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activity, setActivity] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<AdminUserDetailTabKey>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<AdminUserProfileFormState>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    emailVerified: false,
  });
  const [policyFlags, setPolicyFlags] = useState<AdminUserPolicyFlagsState>({
    isAdmin: false,
    isDisabled: false,
    isHidden: false,
    forcePasswordChange: false,
    loginAttemptsBeforeLockout: -1,
  });
  const [policy, setPolicy] = useState<GiftistryUserPolicy>(DEFAULT_USER_POLICY);
  const [newPassword, setNewPassword] = useState('');
  const [isTransferringOwnership, setIsTransferringOwnership] = useState(false);

  const loadUser = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await adminApi.getUser(userId);
      setUser(res.User);
      setActivity(res.Activity ?? []);
      setProfileForm({
        username: res.User.Username,
        email: res.User.Email,
        firstName: res.User.FirstName,
        lastName: res.User.LastName,
        bio: res.User.Bio ?? '',
        emailVerified: !!res.User.EmailVerified,
      });
      setPolicyFlags({
        isAdmin: !!res.User.IsAdmin,
        isDisabled: !!res.User.IsDisabled,
        isHidden: !!res.User.IsHidden,
        forcePasswordChange: !!res.User.ForcePasswordChange,
        loginAttemptsBeforeLockout: res.User.LoginAttemptsBeforeLockout ?? -1,
      });
      setPolicy(res.User.Policy ?? DEFAULT_USER_POLICY);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  const isSelf = currentUser?.Id === userId;

  const saveProfile = async () => {
    if (!userId) return;
    try {
      if (isSelf) {
        await adminApi.updateUser(userId, {
          username: profileForm.username,
          email: profileForm.email,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          bio: profileForm.bio,
          emailVerified: profileForm.emailVerified,
        });
      } else {
        await adminApi.updateUser(userId, { emailVerified: profileForm.emailVerified });
      }
      showToast('Profile updated', 'success');
      loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    }
  };

  const savePolicy = async () => {
    if (!userId) return;
    try {
      await adminApi.updateUserPolicy(userId, { ...policyFlags, policy });
      showToast('Permissions updated', 'success');
      loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update permissions', 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!userId || !newPassword) return;
    try {
      await adminApi.resetPassword(userId, newPassword, true);
      showToast('Password reset', 'success');
      setNewPassword('');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to reset password', 'error');
    }
  };

  const handleUnlock = async () => {
    if (!userId) return;
    try {
      await adminApi.unlockUser(userId);
      showToast('Account unlocked', 'success');
      loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to unlock account', 'error');
    }
  };

  const handleRevokeSessions = async () => {
    if (!userId) return;
    try {
      await adminApi.revokeSessions(userId);
      showToast('Sessions revoked', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to revoke sessions', 'error');
    }
  };

  const handleDelete = async () => {
    if (!userId || !user) return;
    if (!window.confirm(`Delete user @${user.Username}? This cannot be undone.`)) return;
    try {
      await adminApi.deleteUser(userId);
      showToast('User deleted', 'success');
      window.location.href = '/settings/admin/users';
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user', 'error');
    }
  };

  const canDeleteAccount = !!user && !isSelf && !user.IsOwner;
  const canTransferOwnership =
    !!user &&
    !!currentUser?.IsOwner &&
    !isSelf &&
    !user.IsOwner &&
    !user.IsDisabled;

  const handleTransferOwnership = async () => {
    if (!userId || !user) return;
    if (
      !window.confirm(
        `Transfer server ownership to @${user.Username}? You will no longer be the server owner.`
      )
    ) {
      return;
    }
    setIsTransferringOwnership(true);
    try {
      const res = await adminApi.transferOwnership(userId);
      showToast(
        res.NewOwnerUsername
          ? `Server ownership transferred to @${res.NewOwnerUsername}`
          : 'Server ownership transferred',
        'success'
      );
      await refreshUser();
      await loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to transfer ownership', 'error');
    } finally {
      setIsTransferringOwnership(false);
    }
  };

  const handlePolicyChange = (key: keyof GiftistryUserPolicy, value: boolean | number) => {
    setPolicy((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminUserDetailTabTemplate
      isLoading={isLoading}
      user={user}
      activity={activity}
      activeTab={activeTab}
      profileForm={profileForm}
      policyFlags={policyFlags}
      policy={policy}
      newPassword={newPassword}
      isSelf={isSelf}
      onTabChange={setActiveTab}
      onProfileFormChange={(updates) => setProfileForm((prev) => ({ ...prev, ...updates }))}
      onPolicyFlagsChange={(updates) => setPolicyFlags((prev) => ({ ...prev, ...updates }))}
      onPolicyChange={handlePolicyChange}
      onNewPasswordChange={setNewPassword}
      onSaveProfile={saveProfile}
      onSavePolicy={savePolicy}
      onResetPassword={handleResetPassword}
      onUnlock={handleUnlock}
      onRevokeSessions={handleRevokeSessions}
      onDelete={handleDelete}
      canDeleteAccount={canDeleteAccount}
      canTransferOwnership={canTransferOwnership}
      onTransferOwnership={handleTransferOwnership}
      isTransferringOwnership={isTransferringOwnership}
    />
  );
};
