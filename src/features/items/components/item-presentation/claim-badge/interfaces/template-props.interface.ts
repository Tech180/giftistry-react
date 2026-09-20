export interface ClaimBadgeVisibleEntry {
  key: string;
  userId: string;
  displayName: string;
  initials: string;
  anonymousMarker?: boolean;
}

export type ClaimBadgeMode = 'anonymous-only' | 'avatars';

export interface TemplateProps {
  mode: ClaimBadgeMode;
  ariaLabel: string;
  visibleEntries: ClaimBadgeVisibleEntry[];
  overflowCount: number;
  showAnonymousChip: boolean;
}
