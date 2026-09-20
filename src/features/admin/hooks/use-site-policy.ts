import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../api/admin.api';
import { DEFAULT_USER_POLICY } from '../constants/default-user-policy.constant';
import { INVITE_COPIED_MS } from '../constants/invite-copied-ms.constant';
import { INVITE_DEFAULT_MAX_USES } from '../constants/invite-default-max-uses.constant';
import { INVITE_TTL_HOURS } from '../constants/invite-ttl-hours.constant';
import type { HookProps } from '../interfaces/hook-props.interface';
import type { RegistrationInviteListItem } from '../interfaces/registration-invite-list-item.interface';
import type { RegistrationInviteStatus } from '../interfaces/registration-invite-status.interface';
import type { SitePolicy } from '../interfaces/site-policy.interface';
import type { UseSitePolicyResult } from '../interfaces/use-site-policy-result.interface';

export function useSitePolicy({ showToast }: HookProps): UseSitePolicyResult {
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

  const loadInviteStatus = async () => {
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
  };

  useEffect(() => {
    adminApi
      .getSitePolicy()
      .then((res) => {
        setPolicy({
          ...res.Policy,
          RequireStrongPasswords: res.Policy.RequireStrongPasswords ?? true,
          RegistrationInviteTtlHours: res.Policy.RegistrationInviteTtlHours ?? INVITE_TTL_HOURS,
          RegistrationInviteMaxUses:
            res.Policy.RegistrationInviteMaxUses === undefined
              ? INVITE_DEFAULT_MAX_USES
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
  }, [policy?.RegistrationMode]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const onSave = async () => {
    if (!policy) {
      return;
    }
    setIsSaving(true);
    try {
      const allowedEmailDomains = domainsText
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      const res = await adminApi.updateSitePolicy({ ...policy, AllowedEmailDomains: allowedEmailDomains });
      setPolicy({
        ...res.Policy,
        RegistrationInviteTtlHours: res.Policy.RegistrationInviteTtlHours ?? INVITE_TTL_HOURS,
        RegistrationInviteMaxUses:
          res.Policy.RegistrationInviteMaxUses === undefined
            ? INVITE_DEFAULT_MAX_USES
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

  const onDefaultPolicyToggle = (key: keyof typeof DEFAULT_USER_POLICY, value: boolean | number) => {
    setPolicy((prev) =>
      prev
        ? {
            ...prev,
            DefaultUserPolicy: { ...prev.DefaultUserPolicy, [key]: value },
          }
        : prev,
    );
  };

  const onRegenerateInvite = async () => {
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

  const onCopyInviteUrl = async (url: string, inviteId?: string | null) => {
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
      }, INVITE_COPIED_MS);
    } catch {
      showToast('Failed to copy invite link', 'error');
    }
  };

  const onDeleteInvite = async (invite: RegistrationInviteListItem) => {
    const confirmed = window.confirm(
      'Delete this invite link? Anyone with the link will no longer be able to register with it.',
    );
    if (!confirmed) {
      return;
    }

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

  return {
    isLoading,
    policy,
    domainsText,
    isSaving,
    inviteStatus,
    inviteUrl,
    inviteCopied,
    inviteCopiedId,
    isInviteLoading,
    isRegeneratingInvite,
    deletingInviteId,
    onPolicyChange: setPolicy,
    onDomainsTextChange: setDomainsText,
    onDefaultPolicyToggle,
    onSave,
    onRegenerateInvite,
    onCopyInviteUrl,
    onDeleteInvite,
  };
}
