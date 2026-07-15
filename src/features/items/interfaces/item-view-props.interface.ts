import React from 'react';
import { ItemViewMode } from '../types/item-view-mode.type';
import { ItemCardTemplateProps } from './item-card-template-props.interface';

export interface ItemViewProps extends ItemCardTemplateProps {
  viewMode: ItemViewMode;
  aiEnabled?: boolean;
  canShowAi?: boolean;
}
