import type { RefObject } from 'react';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  isSortOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  onToggleSort: () => void;
  onSelectSort: (method: Props['sortMethod']) => void;
}
