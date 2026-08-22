import type {
  FloatingAction,
  FloatingActionPanelHelpers,
} from './floating-action.interface';

export interface FloatingActionMenuTemplateProps {
  actions: FloatingAction[];
  dockState: 'closed' | 'toolbar' | 'panel';
  expandedActionId: string | null;
  ariaLabel: string;
  className?: string;
  rootClass: string;
  toolbarHeight: number;
  panelHeight: number;
  panelWidth: number;
  hidePanelHeader: boolean;
  panelHelpers: FloatingActionPanelHelpers;
  setDockState: (state: 'closed' | 'toolbar' | 'panel') => void;
  onActionClick: (actionId: string) => void;
  onChildClick: (actionId: string, childId: string) => void;
  tooltip: { text: string; top: number; left: number; visible: boolean };
  onTooltipHover: (e: React.MouseEvent<HTMLButtonElement>, text: string) => void;
  onTooltipLeave: () => void;
}
