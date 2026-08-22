import type { KeyboardEvent, RefObject } from 'react';
import { TagsProps } from './tags-props.interface';

export interface TagsTemplateProps extends TagsProps {
  listRef: RefObject<HTMLDivElement | null>;
  canScroll: boolean;
  canScrollUp: boolean;
  canScrollDown: boolean;
  onScroll: () => void;
  onScrollUp: () => void;
  onScrollDown: () => void;
  onListKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}
