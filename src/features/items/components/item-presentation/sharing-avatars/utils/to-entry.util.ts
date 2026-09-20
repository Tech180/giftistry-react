import type { ItemAudienceUser } from '../../../../interfaces/item-audience-user.interface';
import {
  getAudienceDisplayName,
  getAudienceUserInitials,
} from '../../../../utils/item-audience.util';
import type { AvatarEntry } from '../interfaces/avatar-entry.interface';

export function toEntry(user: ItemAudienceUser): AvatarEntry {
  return {
    userId: user.UserId,
    displayName: getAudienceDisplayName(user),
    initials: getAudienceUserInitials(user),
    username: user.Username ?? undefined,
    firstName: user.FirstName ?? undefined,
    lastName: user.LastName ?? undefined,
  };
}
