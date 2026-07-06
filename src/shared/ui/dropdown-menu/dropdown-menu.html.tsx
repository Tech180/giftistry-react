import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { DropdownMenuTemplateProps } from './interfaces/dropdown-menu-template-props.interface';

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
    <EnterPanel ref={menuRef} animation="dropdown" className={menuClass} role="menu">
      {children}
    </EnterPanel>
  );
};
