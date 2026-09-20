import type { ReactNode } from 'react';
import type { PanelPhase } from '../../../interfaces/panel-phase.type';

export interface StepPanelProps {
  panelPhase: PanelPhase;
  panelKey: string;
  children: ReactNode;
}
