import React from 'react';
import type { TimelineProps } from './interfaces/timeline-props.interface';
import { TimelineTemplate } from './timeline.html';

export type { TimelineStep } from './interfaces/timeline-step.interface';

export const Timeline: React.FC<TimelineProps> = ({ steps, activeIndex }) => (
  <TimelineTemplate steps={steps} activeIndex={activeIndex} />
);
