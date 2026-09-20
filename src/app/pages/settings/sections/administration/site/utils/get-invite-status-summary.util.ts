import type { RegistrationInviteStatus } from 'features/admin';

export function getInviteStatusSummary(inviteStatus: RegistrationInviteStatus | null | undefined): string {
  if (!inviteStatus) {
    return 'Loading invite status…';
  }

  const invites = inviteStatus.Invites ?? [];
  const activeCount = invites.filter((i) => i.Status === 'active').length;

  if (activeCount > 0) {
    return `${activeCount} active invite link${activeCount === 1 ? '' : 's'}`;
  }

  return invites.length > 0 ? 'No active invites — generate a new link' : 'No invite yet — generate to create a link';
}
