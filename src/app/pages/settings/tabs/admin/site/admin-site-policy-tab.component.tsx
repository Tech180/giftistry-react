import React, { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi, DEFAULT_USER_POLICY } from 'features/admin';
import type {
  RegistrationInviteListItem,
  RegistrationInviteStatus,
  SitePolicy,
} from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminSitePolicyTabTemplate } from './admin-site-policy-tab.html';

export const AdminSitePolicyTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [policy, setPolicy] = useState<SitePolicy | null>(null);
  const [domainsText, setDomainsText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<RegistrationInviteStatus | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteCopiedId, setInviteCopiedId] = useState<string | null>(null);
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isRegeneratingInvite, setIsRegeneratingInvite] = useState(false);
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadInviteStatus = useCallback(async () => {
    setIsInviteLoading(true);
    try {
      const status = await adminApi.getRegistrationInvite();
      setInviteStatus({
        ...status,
        Invites: status.Invites ?? [],
      });
      const latestActive = (status.Invites ?? []).find((invite) => invite.Status === 'active' && invite.Url);
      if (latestActive?.Url) {
        setInviteUrl(latestActive.Url);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load invite status', 'error');
    } finally {
      setIsInviteLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    adminApi
      .getSitePolicy()
      .then((res) => {
        setPolicy({
          ...res.Policy,
          RequireStrongPasswords: res.Policy.RequireStrongPasswords ?? true,
          RegistrationInviteTtlHours: res.Policy.RegistrationInviteTtlHours ?? 168,
          RegistrationInviteMaxUses:
            res.Policy.RegistrationInviteMaxUses === undefined
              ? 1
              : res.Policy.RegistrationInviteMaxUses,
        });
        setDomainsText((res.Policy.AllowedEmailDomains ?? []).join(', '));
      })
      .catch((err) => showToast(err.message || 'Failed to load site policy', 'error'))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  useEffect(() => {
    if (policy?.RegistrationMode === 'invite_only') {
      void loadInviteStatus();
    }
  }, [policy?.RegistrationMode, loadInviteStatus]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const save = async () => {
    if (!policy) return;
    setIsSaving(true);
    try {
      const allowedEmailDomains = domainsText
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      const res = await adminApi.updateSitePolicy({ ...policy, AllowedEmailDomains: allowedEmailDomains });
      setPolicy({
        ...res.Policy,
        RegistrationInviteTtlHours: res.Policy.RegistrationInviteTtlHours ?? 168,
        RegistrationInviteMaxUses:
          res.Policy.RegistrationInviteMaxUses === undefined
            ? 1
            : res.Policy.RegistrationInviteMaxUses,
      });
      showToast('Site policy saved', 'success');
      if (res.Policy.RegistrationMode === 'invite_only') {
        void loadInviteStatus();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to save site policy', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDefaultPolicy = (key: keyof typeof DEFAULT_USER_POLICY, value: boolean | number) => {
    setPolicy((prev) =>
      prev
        ? {
            ...prev,
            DefaultUserPolicy: { ...prev.DefaultUserPolicy, [key]: value },
          }
        : prev
    );
  };

  const regenerateInvite = async () => {
    setIsRegeneratingInvite(true);
    try {
      const result = await adminApi.regenerateRegistrationInvite();
      setInviteUrl(result.Url);
      setInviteCopied(false);
      setInviteCopiedId(null);
      await loadInviteStatus();
      showToast('Invite link generated', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to generate invite', 'error');
    } finally {
      setIsRegeneratingInvite(false);
    }
  };

  const copyInviteUrl = async (url: string, inviteId?: string | null) => {
    try {
      await navigator.clipboard.writeText(url);
      setInviteCopied(true);
      setInviteCopiedId(inviteId ?? null);
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => {
        setInviteCopied(false);
        setInviteCopiedId(null);
      }, 2000);
    } catch {
      showToast('Failed to copy invite link', 'error');
    }
  };

  const deleteInvite = async (invite: RegistrationInviteListItem) => {
    const confirmed = window.confirm(
      'Delete this invite link? Anyone with the link will no longer be able to register with it.'
    );
    if (!confirmed) return;

    setDeletingInviteId(invite.Id);
    try {
      await adminApi.deleteRegistrationInvite(invite.Id);
      if (inviteUrl && invite.Url === inviteUrl) {
        setInviteUrl(null);
      }
      await loadInviteStatus();
      showToast('Invite link deleted', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete invite', 'error');
    } finally {
      setDeletingInviteId(null);
    }
  };

  return (
    <AdminSitePolicyTabTemplate
      isLoading={isLoading}
      policy={policy}
      domainsText={domainsText}
      isSaving={isSaving}
      inviteStatus={inviteStatus}
      inviteUrl={inviteUrl}
      inviteCopied={inviteCopied}
      inviteCopiedId={inviteCopiedId}
      isInviteLoading={isInviteLoading}
      isRegeneratingInvite={isRegeneratingInvite}
      deletingInviteId={deletingInviteId}
      onPolicyChange={setPolicy}
      onDomainsTextChange={setDomainsText}
      onDefaultPolicyToggle={toggleDefaultPolicy}
      onSave={save}
      onRegenerateInvite={regenerateInvite}
      onCopyInviteUrl={copyInviteUrl}
      onDeleteInvite={deleteInvite}
    />
  );
};
