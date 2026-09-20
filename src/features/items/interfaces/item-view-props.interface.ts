import type { ItemViewMode } from './item-view-mode.type';
import type { TemplateProps } from '../components/card/interfaces/template-props.interface';

export interface ItemViewProps extends TemplateProps {
  viewMode: ItemViewMode;
  aiEnabled?: boolean;
  canShowAi?: boolean;
}
