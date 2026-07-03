import { ReactNode, RefObject } from 'react';

export interface DropdownMenuProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  menuRef?: RefObject<HTMLDivElement | null>;
}
