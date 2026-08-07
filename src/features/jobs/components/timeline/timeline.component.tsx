import React from 'react';
import type { TimelineProps } from './interfaces/timeline-props.interface';
import { TimelineTemplate } from './timeline.html';

export const Timeline: React.FC<TimelineProps> = (props) => {
  return <TimelineTemplate {...props} />;
};
