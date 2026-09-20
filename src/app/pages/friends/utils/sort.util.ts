import type { Friend } from 'features/friends';
import type { SortMethod } from '../interfaces/sort-method.type';

export function sortByMethod(friends: Friend[], method: SortMethod): Friend[] {
  const list = [...friends];
  if (method === 'name') {
    list.sort((a, b) => {
      const nameA = `${a.FirstName || ''} ${a.LastName || ''}`.trim();
      const nameB = `${b.FirstName || ''} ${b.LastName || ''}`.trim();
      return nameA.localeCompare(nameB);
    });
  } else if (method === 'recent') {
    list.sort((a, b) => {
      const dateA = a.FriendsSince ? new Date(a.FriendsSince).getTime() : 0;
      const dateB = b.FriendsSince ? new Date(b.FriendsSince).getTime() : 0;
      return dateB - dateA;
    });
  } else if (method === 'birthday') {
    list.sort((a, b) => (a.DaysUntilBirthday ?? 999) - (b.DaysUntilBirthday ?? 999));
  }
  return list;
}
