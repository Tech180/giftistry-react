import type { MetaBadgeEntry } from './props.interface';

export interface TemplateProps {
  entries: MetaBadgeEntry[];
  sectionTitle: string;
  sectionVariant: 'inline' | 'card';
  sectionClassName: string;
  labelClassName: string;
  listClassName: string;
  badgeClassName: string;
}
