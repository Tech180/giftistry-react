import type { ClaimBadgeEntry } from '../../../../interfaces/claim-badge-entry.interface';

export function buildClaimBadgeAriaLabel(entries: ClaimBadgeEntry[]): string {
  const names = entries.map((entry) =>
    entry.anonymousMarker ? `${entry.displayName} (anonymous)` : entry.displayName
  );
  if (names.length === 0) {
    return 'Claimed by';
  }
  if (names.length === 1) {
    return `Claimed by ${names[0]}`;
  }
  if (names.length === 2) {
    return `Claimed by ${names[0]} and ${names[1]}`;
  }
  const head = names.slice(0, -1).join(', ');
  return `Claimed by ${head}, and ${names[names.length - 1]}`;
}

export function getClaimInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}
