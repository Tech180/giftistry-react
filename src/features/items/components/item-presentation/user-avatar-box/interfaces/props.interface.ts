import type { ReactNode } from 'react';
import type { Variant } from './variant.type';

export interface Props {
  title: string;
  ariaLabel: string;
  variant?: Variant;
  children: ReactNode;
}
