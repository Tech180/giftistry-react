import type { Friend } from '../interfaces/friend.interface';

export function getFriendInitials(friend: Friend): string {
  const username = friend.Username || 'user';
  return (
    friend.FirstName
      ? `${friend.FirstName.charAt(0)}${friend.LastName ? friend.LastName.charAt(0) : ''}`
      : username.slice(0, 2)
  ).toUpperCase();
}
