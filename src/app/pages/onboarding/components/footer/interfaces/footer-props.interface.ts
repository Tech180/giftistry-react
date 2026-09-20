import type { PanelPhase } from '../../../interfaces/panel-phase.type';
import type { StepId } from '../../../interfaces/step-id.type';

export interface FooterProps {
  step: number;
  stepId: StepId;
  panelPhase: PanelPhase;
  isSubmitting: boolean;
  canSkip: boolean;
  primaryCtaLabel: string;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}
