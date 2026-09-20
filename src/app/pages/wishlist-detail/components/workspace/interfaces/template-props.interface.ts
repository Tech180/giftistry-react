import type { ReactNode } from 'react';
import type { Props as ItemsProps } from '../../items/interfaces/props.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  addItemWidget: ReactNode;
  itemsProps: ItemsProps;
}
