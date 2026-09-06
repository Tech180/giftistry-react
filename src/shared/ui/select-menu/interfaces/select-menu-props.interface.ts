import type { SelectMenuOption } from './select-menu-option.interface';

export interface SelectMenuProps {
  value: string;
  options: SelectMenuOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  /** compact = list chip; field = bordered form control */
  variant?: 'compact' | 'field';
  /** Shown in palette header; omit to hide header */
  menuTitle?: string;
  'aria-label'?: string;
  className?: string;
  id?: string;
}
