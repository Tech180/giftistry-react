import { OnboardingTimelineStep } from './onboarding-timeline-step.interface';

export interface OnboardingTimelineProps {
  steps: OnboardingTimelineStep[];
  activeIndex: number;
}
