import type { ShowcaseRelationItem } from '../../../../../interfaces/showcase-relation-item.interface';

export interface TemplateProps {
  title: string;
  items: ShowcaseRelationItem[];
  sectionClassName: string;
  labelClassName: string;
  listClassName: string;
  itemClassName: string;
  statusClassName: string;
}
