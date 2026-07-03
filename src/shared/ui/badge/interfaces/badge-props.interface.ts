import { ReactNode } from 'react';
import { BadgeVariant } from './badge-variant.interface';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}
