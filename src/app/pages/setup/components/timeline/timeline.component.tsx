import React from 'react';
import { TimelineTemplate } from './timeline.html';
import { STEPS } from './constants/steps.constant';
import type { TimelineProps } from './interfaces/props.interface';

export const Timeline: React.FC<TimelineProps> = ({ step }) => {
  const steps = STEPS.map((s) => ({
    ...s,
    completed: step >= 4 ? true : step > s.id,
    active: step >= 4 ? false : step === s.id,
  }));

  return (
    <TimelineTemplate
      steps = {
        steps
      }
    />
  );
};
