import React from 'react';
import { DropdownMenuTemplateProps } from './interfaces/dropdown-menu-template-props.interface';
import styles from './dropdown-menu.module.css';

export const DropdownMenuTemplate: React.FC<DropdownMenuTemplateProps> = ({
  isOpen,
  children,
  menuRef,
  menuClass,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div ref={menuRef} className={menuClass} role="menu">
      {children}
    </div>
  );
};
