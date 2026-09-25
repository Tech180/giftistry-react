import type { ListShare, Wishlist } from 'features/wishlists';
import { TOUR_DEMO_LIST_ID } from '../../constants/targets.constant';
import { USER_JORDAN, USER_SAM } from '../constants/users.constant';

function share(
  userId: string,
  username: string,
  firstName: string,
  lastName: string
): ListShare {
  return {
    Id: `tour-demo-share-${userId}`,
    ListId: TOUR_DEMO_LIST_ID,
    UserId: userId,
    Role: 'collaborator',
    Username: username,
    FirstName: firstName,
    LastName: lastName,
  };
}

export function buildWishlist(ownerId: string, ownerName: string): Wishlist {
  return {
    Id: TOUR_DEMO_LIST_ID,
    UserId: ownerId,
    Title: `${ownerName}'s Birthday (sample)`,
    Category: 'birthday',
    ExpiresAt: null,
    IsActive: true,
    AllowGroupFunds: false,
    AutoRollover: false,
    AiEnabled: false,
    WebSearchEnabled: false,
    Role: 'owner',
    Shares: [
      share(USER_JORDAN, 'Jordan', 'Jordan', 'Lee'),
      share(USER_SAM, 'Sam', 'Sam', 'Rivera'),
    ],
  };
}
