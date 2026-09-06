import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { SelectMenuOption } from './select-menu-option.interface';

export interface SelectMenuTemplateProps {
  triggerRef: RefObject<HTMLButtonElement | null>;
  menuRef: RefObject<HTMLDivElement | null>;
  listboxId: string;
  isOpen: boolean;
  disabled: boolean;
  triggerClass: string;
  panelClass: string;
  panelStyle: CSSProperties;
  selectedLabel: string;
  menuTitle?: string;
  options: SelectMenuOption[];
  focusedIndex: number;
  value: string;
  ariaLabel?: string;
  id?: string;
  checkIcon: ReactNode;
  chevronSize: number;
  chevronClass: string;
  onToggle: () => void;
  onSelect: (value: string) => void;
  onOptionMouseEnter: (index: number) => void;
}
