export interface MetadataGridProps {
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
  priority?: number | null;
  variant?: 'badges' | 'compact';
  compactAlign?: 'start' | 'end';
}
