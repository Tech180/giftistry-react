import type { RefObject } from 'react';

export interface UseMobileDrawerParams {
  isOpen: boolean;
  onClose: () => void;
  drawerRef: RefObject<HTMLDivElement | null>;
  isAuthenticated: boolean;
}
