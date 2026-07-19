import type { FloatingAction } from './floating-action.interface';

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
  setDockState: (state: 'closed' | 'toolbar' | 'panel') => void;
  onActionClick: (actionId: string) => void;
  onChildClick: (actionId: string, childId: string) => void;
  tooltip: { text: string; top: number; left: number; visible: boolean };
  onTooltipHover: (e: React.MouseEvent<HTMLButtonElement>, text: string) => void;
  onTooltipLeave: () => void;
}
