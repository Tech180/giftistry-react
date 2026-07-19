import React from 'react';
import { OnboardingTimelineTemplate } from './onboarding-timeline.html';
import { OnboardingTimelineProps } from './interfaces/onboarding-timeline-props.interface';

export type { OnboardingTimelineStep } from './interfaces/onboarding-timeline-step.interface';

export const OnboardingTimeline: React.FC<OnboardingTimelineProps> = ({ steps, activeIndex }) => {
  return <OnboardingTimelineTemplate steps={steps} activeIndex={activeIndex} />;
};
