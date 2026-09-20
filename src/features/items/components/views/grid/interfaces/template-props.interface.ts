import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  rootClassName: string;
  iconClassName: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  primaryPrice: number | null | undefined;
  primaryImageUrl: string | null;
  isSelectable: boolean;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  suggestedByDisplayName: string;
}
