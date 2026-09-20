export function getOwnerInitials(displayName: string, firstName?: string, username?: string): string {
  if (firstName?.trim()) {
    return firstName.trim()[0]!.toUpperCase();
  }

  if (username?.trim()) {
    return username.trim()[0]!.toUpperCase();
  }

  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}
