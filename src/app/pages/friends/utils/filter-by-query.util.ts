import type { Friend } from 'features/friends';

export function filterByQuery(friends: Friend[], query: string): Friend[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    return friends;
  }

  return friends.filter((f) => {
    const name = `${f.FirstName || ''} ${f.LastName || ''}`.toLowerCase();
    const username = (f.Username || '').toLowerCase();
    return name.includes(q) || username.includes(q);
  });
}
