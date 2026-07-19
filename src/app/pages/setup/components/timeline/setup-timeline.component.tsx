import React from 'react';
import { SetupTimelineTemplate } from './setup-timeline.html';
import { SetupTimelineProps } from './interfaces/setup-timeline-props.interface';

export const SetupTimeline: React.FC<SetupTimelineProps> = ({ step }) => {
  const steps = [
    { id: 1, label: 'Database', desc: 'Storage configuration' },
    { id: 2, label: 'Administrator', desc: 'Create primary user' },
    { id: 3, label: 'Installation', desc: 'System initialization' },
  ];

  return <SetupTimelineTemplate step={step} steps={steps} />;
};
