import type { StepId } from '../../../interfaces/step-id.type';

export interface HeaderProps {
  step: number;
  totalSteps: number;
  visibleStepId: StepId;
  title: string;
  subtitle: string;
}
