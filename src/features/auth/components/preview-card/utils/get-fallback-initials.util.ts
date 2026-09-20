import { getInitialsFromDisplayName } from 'shared/utils/get-initials.util';

export function getFallbackInitials(nameStr: string): string {
  return getInitialsFromDisplayName(nameStr);
}
