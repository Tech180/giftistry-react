import { RefObject, TouchEventHandler } from 'react';
import { MobileDrawerProps } from './mobile-drawer-props.interface';

export interface MobileDrawerTemplateProps extends MobileDrawerProps {
  isActive: boolean;
  isDragging: boolean;
  showSwipeHandle: boolean;
  isDashboardActive: boolean;
  brandTo: string;
  overlayRef: RefObject<HTMLDivElement | null>;
  onTouchStart: TouchEventHandler<HTMLDivElement>;
  onTouchMove: TouchEventHandler<HTMLDivElement>;
  onTouchEnd: TouchEventHandler<HTMLDivElement>;
  overlayClassName: string;
  drawerClassName: string;
}
