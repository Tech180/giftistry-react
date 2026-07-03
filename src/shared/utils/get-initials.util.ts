export function getInitialsFromNames(
  firstName: string,
  lastName: string,
  fallback = 'U'
): string {
  const f = firstName.trim();
  const l = lastName.trim();
  const initials = (f.charAt(0) + l.charAt(0)).toUpperCase();
  return initials || fallback;
}

export function getInitialsFromDisplayName(nameStr: string): string {
  const parts = nameStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nameStr.slice(0, 2).toUpperCase();
}

export function getJoinedDate(createdAt?: string): string {
  if (!createdAt) return 'Joined recently';
  const date = new Date(createdAt);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
}
