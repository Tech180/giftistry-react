import React from 'react';
import ReactDOM from 'react-dom';
import { useMobileDrawer } from './hooks/use-mobile-drawer';
import { MobileDrawerProps } from './interfaces/mobile-drawer-props.interface';
import { MobileDrawerTemplate } from './mobile-drawer.html';

export const MobileDrawer: React.FC<MobileDrawerProps> = (props) => {
  const { isOpen, onClose, drawerRef, isAuthenticated } = props;
  const drawer = useMobileDrawer({ isOpen, onClose, drawerRef, isAuthenticated });

  if (!drawer.mounted) return null;

  return ReactDOM.createPortal(
    <MobileDrawerTemplate
      {...props}
      isActive={drawer.isActive}
      isDragging={drawer.isDragging}
      showSwipeHandle={drawer.showSwipeHandle}
      isDashboardActive={drawer.isDashboardActive}
      brandTo={drawer.brandTo}
      overlayRef={drawer.overlayRef}
      onTouchStart={drawer.onTouchStart}
      onTouchMove={drawer.onTouchMove}
      onTouchEnd={drawer.onTouchEnd}
      overlayClassName={drawer.overlayClassName}
      drawerClassName={drawer.drawerClassName}
    />,
    document.body
  );
};
