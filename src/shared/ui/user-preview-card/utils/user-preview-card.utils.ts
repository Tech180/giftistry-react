import { ApiUser } from 'features/auth';
import {
  getInitialsFromDisplayName,
  getInitialsFromNames,
  getJoinedDate as formatJoinedDate,
} from 'shared/utils/get-initials.util';

export function getUserInitials(user: ApiUser): string {
  if (user.FirstName && user.LastName) {
    return getInitialsFromNames(
      user.FirstName,
      user.LastName,
      user.Username.slice(0, 2).toUpperCase()
    );
  }
  return user.Username.slice(0, 2).toUpperCase();
}

export function getFallbackInitials(nameStr: string): string {
  return getInitialsFromDisplayName(nameStr);
}

export function getJoinedDate(createdAt?: string): string {
  return formatJoinedDate(createdAt);
}
