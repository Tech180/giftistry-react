import { PublicUserSummary } from 'shared/interfaces/public-user-summary.interface';
import { Friend } from '../interfaces/friend.interface';

export function toPreviewFallback(friend: Friend): Partial<PublicUserSummary> {
  return {
    Username: friend.Username,
    FirstName: friend.FirstName,
    LastName: friend.LastName,
    Avatar: friend.Avatar,
    LastOnline: friend.LastOnline,
    WishlistCount: friend.WishlistCount,
    MutualsCount: friend.MutualsCount,
    Birthday: friend.Birthday,
  };
}
