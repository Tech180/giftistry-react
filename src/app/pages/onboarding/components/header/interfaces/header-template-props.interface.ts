import type { StepId } from '../../../interfaces/step-id.type';

export interface HeaderTemplateProps {
  step: number;
  totalSteps: number;
  visibleStepId: StepId;
  title: string;
  subtitle: string;
}
