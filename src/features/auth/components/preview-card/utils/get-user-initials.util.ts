import type { ApiUser } from '../../../interfaces/api-user.interface';
import { getInitialsFromNames } from 'shared/utils/get-initials.util';

export function getUserInitials(user: Partial<ApiUser>): string {
  const usernameFallback = user.Username?.slice(0, 2).toUpperCase() ?? '??';
  if (user.FirstName && user.LastName) {
    return getInitialsFromNames(user.FirstName, user.LastName, usernameFallback);
  }
  return usernameFallback;
}
