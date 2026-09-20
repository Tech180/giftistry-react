import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';
import type { RegistrationInviteListItem } from './registration-invite-list-item.interface';
import type { RegistrationInviteStatus } from './registration-invite-status.interface';
import type { SitePolicy } from './site-policy.interface';

export interface UseSitePolicyResult {
  isLoading: boolean;
  policy: SitePolicy | null;
  domainsText: string;
  isSaving: boolean;
  inviteStatus: RegistrationInviteStatus | null;
  inviteUrl: string | null;
  inviteCopied: boolean;
  inviteCopiedId: string | null;
  isInviteLoading: boolean;
  isRegeneratingInvite: boolean;
  deletingInviteId: string | null;
  onPolicyChange: (policy: SitePolicy) => void;
  onDomainsTextChange: (value: string) => void;
  onDefaultPolicyToggle: (key: keyof GiftistryUserPolicy, value: boolean | number) => void;
  onSave: () => void;
  onRegenerateInvite: () => void;
  onCopyInviteUrl: (url: string, inviteId?: string | null) => void;
  onDeleteInvite: (invite: RegistrationInviteListItem) => void;
}
