import type { UserStatus } from '../interfaces/user-status.interface';

export function getUserStatus(user: { IsDisabled: boolean; LockedUntil: string | null }): UserStatus {
  if (user.IsDisabled) {
    return { label: 'Disabled', tone: 'disabled' };
  }

  if (user.LockedUntil && new Date(user.LockedUntil) > new Date()) {
    return { label: 'Locked', tone: 'locked' };
  }

  return { label: 'Active', tone: 'active' };
}
