import type { ReactNode } from 'react';

export interface FloatingActionChild {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface FloatingActionPanelHelpers {
  closeMenu: () => void;
}

export interface FloatingAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Nested actions (e.g. export formats). When present, primary onClick is optional. */
  children?: FloatingActionChild[];
  /**
   * Custom panel body (e.g. upload dropzone). Takes precedence over children when both are set.
   * May be a render function that receives helpers such as closeMenu.
   */
  panelContent?: ReactNode | ((helpers: FloatingActionPanelHelpers) => ReactNode);
  /** Panel width in px when panelContent is used. Defaults to 280. */
  panelWidth?: number;
  /** Panel height in px when panelContent is used. Defaults to 300. */
  panelHeight?: number;
}
