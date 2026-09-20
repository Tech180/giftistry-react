import React from 'react';
import { DropdownMenuProps } from './interfaces/dropdown-menu-props.interface';
import { DropdownMenuTemplate } from './dropdown-menu.html';
import styles from './dropdown-menu.module.css';

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  children,
  className = '',
  menuRef,
}) => {
  const menuClass = [styles.menu, className].filter(Boolean).join(' ');

  return (
    <DropdownMenuTemplate
      isOpen = {
        isOpen
      }
      menuRef = {
        menuRef
      }
      menuClass = {
        menuClass
      }
    >
      {children}
    </DropdownMenuTemplate>
  );
};
