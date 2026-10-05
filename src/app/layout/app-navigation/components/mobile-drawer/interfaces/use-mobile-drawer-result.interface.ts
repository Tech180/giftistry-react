import type { RefObject, TouchEventHandler } from 'react';

export interface UseMobileDrawerResult {
  mounted: boolean;
  isActive: boolean;
  isDragging: boolean;
  showSwipeHandle: boolean;
  isDashboardActive: boolean;
  isFriendsActive: boolean;
  brandTo: string;
  overlayRef: RefObject<HTMLDivElement | null>;
  onTouchStart: TouchEventHandler<HTMLDivElement>;
  onTouchMove: TouchEventHandler<HTMLDivElement>;
  onTouchEnd: TouchEventHandler<HTMLDivElement>;
  overlayClassName: string;
  drawerClassName: string;
}
