import type { CSSProperties, ReactNode } from 'react';
import type { FloatingAction } from './floating-action.interface';
import type { FloatingActionPanelHelpers } from './floating-action-panel-helpers.interface';

export interface FloatingActionMenuTemplateProps {
  actions: FloatingAction[];
  dockState: 'closed' | 'toolbar' | 'panel';
  expandedActionId: string | null;
  expandedAction: FloatingAction | null;
  ariaLabel: string;
  rootClass: string;
  dockSizeStyle?: CSSProperties;
  hidePanelHeader: boolean;
  panelBody: ReactNode;
  faceClosedClass: string;
  faceToolbarClass: string;
  facePanelClass: string;
  backdropClass: string;
  tooltipClass: string;
  setDockState: (state: 'closed' | 'toolbar' | 'panel') => void;
  onActionClick: (actionId: string) => void;
  onChildClick: (actionId: string, childId: string) => void;
  tooltip: { text: string; top: number; left: number; visible: boolean };
  onTooltipHover: (e: React.MouseEvent<HTMLButtonElement>, text: string) => void;
  onTooltipLeave: () => void;
}
