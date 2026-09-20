import type { ReactNode } from 'react';
import type { FloatingActionChild } from './floating-action-child.interface';
import type { FloatingActionPanelHelpers } from './floating-action-panel-helpers.interface';

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
  /** Extra grayed appearance without blocking clicks (e.g. view-only Settings). */
  toolbarMuted?: boolean;
  /** When true, render a toolbar divider after this action. */
  separateAfter?: boolean;
}
