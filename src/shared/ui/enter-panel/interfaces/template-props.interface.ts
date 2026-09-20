import type { ElementType, HTMLAttributes, ReactNode, RefObject } from 'react';

export interface TemplateProps extends HTMLAttributes<HTMLDivElement> {
  Tag: ElementType;
  className: string;
  children: ReactNode;
  elementRef: RefObject<HTMLDivElement | null>;
}
