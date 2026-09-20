export interface MetaBadgeEntry {
  label: string;
  value: string;
  emoji?: string;
}

export interface Props {
  entries: MetaBadgeEntry[];
  sectionTitle: string;
  sectionVariant: 'inline' | 'card';
}
