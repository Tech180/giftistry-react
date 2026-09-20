import type { ItemViewMode } from '../../../interfaces/item-view-mode.type';

export interface TemplateProps {
  viewMode: ItemViewMode;
  label: string;
  shellClassName: string;
  innerClassName: string;
  bodyClassName: string;
  rowClassName: string;
  barTitleClassName: string;
  barPillClassName: string;
  barMetaClassName: string;
  barLineClassName: string;
  barShortClassName: string;
  thumbClassName: string;
  avatarClassName: string;
}
