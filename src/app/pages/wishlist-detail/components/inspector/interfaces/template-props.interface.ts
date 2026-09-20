import type { ComponentType } from 'react';
import type { ItemShowcaseProps } from 'features/items';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  showcaseProps: ItemShowcaseProps | null;
  categoryLabel: string | null;
  CategoryIcon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }> | null;
}
