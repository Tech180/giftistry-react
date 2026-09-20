import type { ReactNode } from 'react';
import type { PanelPhase } from '../../../interfaces/panel-phase.type';

export interface StepPanelTemplateProps {
  panelPhase: PanelPhase;
  panelKey: string;
  children: ReactNode;
}
