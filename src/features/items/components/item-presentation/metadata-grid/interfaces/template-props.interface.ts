export interface MetadataPreparedEntry {
  key: string;
  label: string;
  value: string;
  emoji?: string;
}

export interface TemplateProps {
  variant: 'badges' | 'compact';
  compactAlign: 'start' | 'end';
  showPriority: boolean;
  priority: number | null;
  predefinedEntries: MetadataPreparedEntry[];
  userDefinedEntries: MetadataPreparedEntry[];
}
