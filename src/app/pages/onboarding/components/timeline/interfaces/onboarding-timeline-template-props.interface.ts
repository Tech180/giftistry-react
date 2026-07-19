import { OnboardingTimelineStep } from './onboarding-timeline-step.interface';

export interface OnboardingTimelineTemplateProps {
  steps: OnboardingTimelineStep[];
  activeIndex: number;
}
