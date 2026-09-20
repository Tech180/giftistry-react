import { useEffect, useState } from 'react';
import { validateUsername } from 'shared/utils/validate-username.util';
import { adminApi } from '../api/admin.api';
import { DEFAULT_USER_POLICY } from '../constants/default-user-policy.constant';
import { INITIAL_POLICY_FLAGS } from '../constants/initial-policy-flags.constant';
import { INITIAL_PROFILE_FORM } from '../constants/initial-profile-form.constant';
import type { AuditLogEntry } from '../interfaces/audit-log-entry.interface';
import type { GiftistryUserPolicy } from '../interfaces/giftistry-user-policy.interface';
import type { UseUserDetailProps } from '../interfaces/use-user-detail-props.interface';
import type { UseUserDetailResult } from '../interfaces/use-user-detail-result.interface';
import type { User } from '../interfaces/user.interface';
import type { UserDetailKey } from '../interfaces/user-detail-key.type';
import type { UserPolicyFlagsState } from '../interfaces/user-policy-flags-state.interface';
import type { UserProfileFormState } from '../interfaces/user-profile-form-state.interface';

export function useUserDetail({
  showToast,
  userId,
  currentUser,
  refreshUser,
}: UseUserDetailProps): UseUserDetailResult {
  const [user, setUser] = useState<User | null>(null);
  const [activity, setActivity] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<UserDetailKey>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState<UserProfileFormState>(INITIAL_PROFILE_FORM);
  const [policyFlags, setPolicyFlags] = useState<UserPolicyFlagsState>(INITIAL_POLICY_FLAGS);
  const [policy, setPolicy] = useState<GiftistryUserPolicy>(DEFAULT_USER_POLICY);
  const [newPassword, setNewPassword] = useState('');
  const [isTransferringOwnership, setIsTransferringOwnership] = useState(false);

  const loadUser = async () => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await adminApi.getUser(userId);
      setUser(res.User);
      setActivity(res.Activity ?? []);
      setProfileForm({
        username: res.User.Username,
        email: res.User.Email ?? '',
        firstName: res.User.FirstName,
        lastName: res.User.LastName,
        bio: res.User.Bio ?? '',
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
    void loadUser();
  }, [userId]);

  const isSelf = currentUser?.Id === userId;
  const isOwnerReadOnly = !!user?.IsOwner && !currentUser?.IsOwner;

  const onSaveProfile = async () => {
    if (!userId || !isSelf || isOwnerReadOnly) {
      return;
    }

    const usernameChanged = profileForm.username !== (user?.Username || '');
    let nextUsername = profileForm.username.trim();
    if (usernameChanged) {
      const usernameCheck = validateUsername(profileForm.username);
      if (!usernameCheck.ok) {
        showToast(usernameCheck.message, 'error');
        return;
      }
      nextUsername = usernameCheck.value;
    }

    try {
      await adminApi.updateUser(userId, {
        username: nextUsername,
        email: profileForm.email,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        bio: profileForm.bio,
      });
      showToast('Profile updated', 'success');
      void loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    }
  };

  const onSavePolicy = async () => {
    if (!userId || isOwnerReadOnly) {
      return;
    }
    try {
      await adminApi.updateUserPolicy(userId, { ...policyFlags, policy });
      showToast('Permissions updated', 'success');
      void loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update permissions', 'error');
    }
  };

  const onResetPassword = async () => {
    if (!userId || !newPassword || isOwnerReadOnly) {
      return;
    }
    try {
      await adminApi.resetPassword(userId, newPassword, true);
      showToast('Password reset', 'success');
      setNewPassword('');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to reset password', 'error');
    }
  };

  const onUnlock = async () => {
    if (!userId || isOwnerReadOnly) {
      return;
    }
    try {
      await adminApi.unlockUser(userId);
      showToast('Account unlocked', 'success');
      void loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to unlock account', 'error');
    }
  };

  const onRevokeSessions = async () => {
    if (!userId || isOwnerReadOnly) {
      return;
    }
    try {
      await adminApi.revokeSessions(userId);
      showToast('Sessions revoked', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to revoke sessions', 'error');
    }
  };

  const onDelete = async () => {
    if (!userId || !user || isOwnerReadOnly) {
      return;
    }
    if (!window.confirm(`Delete user @${user.Username}? This cannot be undone.`)) {
      return;
    }
    try {
      await adminApi.deleteUser(userId);
      showToast('User deleted', 'success');
      window.location.href = '/settings/admin/users';
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user', 'error');
    }
  };

  const canDeleteAccount = !!user && !isSelf && !user.IsOwner && !isOwnerReadOnly;
  const canTransferOwnership =
    !!user && !!currentUser?.IsOwner && !isSelf && !user.IsOwner && !user.IsDisabled;

  const onTransferOwnership = async () => {
    if (!userId || !user) {
      return;
    }
    if (
      !window.confirm(
        `Transfer server ownership to @${user.Username}? You will no longer be the server owner.`,
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
        'success',
      );
      await refreshUser();
      await loadUser();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to transfer ownership', 'error');
    } finally {
      setIsTransferringOwnership(false);
    }
  };

  const onPolicyChange = (key: keyof GiftistryUserPolicy, value: boolean | number) => {
    if (isOwnerReadOnly) {
      return;
    }
    setPolicy((prev) => ({ ...prev, [key]: value }));
  };

  return {
    isLoading,
    user,
    activity,
    activeTab,
    profileForm,
    policyFlags,
    policy,
    newPassword,
    isSelf,
    isOwnerReadOnly,
    onTabChange: setActiveTab,
    onProfileFormChange: (updates) => {
      if (isOwnerReadOnly) {
        return;
      }
      setProfileForm((prev) => ({ ...prev, ...updates }));
    },
    onPolicyFlagsChange: (updates) => {
      if (isOwnerReadOnly) {
        return;
      }
      setPolicyFlags((prev) => ({ ...prev, ...updates }));
    },
    onPolicyChange,
    onNewPasswordChange: (value) => {
      if (isOwnerReadOnly) {
        return;
      }
      setNewPassword(value);
    },
    onSaveProfile,
    onSavePolicy,
    onResetPassword,
    onUnlock,
    onRevokeSessions,
    onDelete,
    canDeleteAccount,
    canTransferOwnership,
    onTransferOwnership,
    isTransferringOwnership,
  };
}
