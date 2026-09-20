import type { RegistrationInviteListStatus } from 'features/admin';

export function inviteStatusBadgeLabel(status: RegistrationInviteListStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'expired':
      return 'Expired';
  }
}
