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
  /** Override the open panel width/height (px). Cleared when leaving panel state. */
  setPanelSize: (width: number, height: number) => void;
  /**
   * When set, Escape in panel state calls this first. Return true to consume
   * the key (skip the default panel → toolbar step).
   */
  setPanelEscapeHandler: (handler: (() => boolean) | null) => void;
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
  /** Skip the default chevron + label header so panelContent can own chrome. */
  hidePanelHeader?: boolean;
  /**
   * When true, skip the toolbar divider that normally precedes panel-opening
   * actions (e.g. keep Restore + Delete in one visual group).
   */
  hideToolbarDivider?: boolean;
  /**
   * Toolbar icon tone. Defaults to `primary` when the action opens a panel,
   * otherwise `default` (muted, like Comments).
   */
  toolbarTone?: 'default' | 'primary' | 'danger';
}
