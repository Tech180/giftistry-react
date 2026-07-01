import React from 'react';
import { SetupTimelineTemplate } from './setup-timeline.html';
import { Database, Mail, User } from 'lucide-react';

interface SetupTimelineProps {
  step: number;
}

export const SetupTimeline: React.FC<SetupTimelineProps> = ({ step }) => {
  const steps = [
    { id: 1, label: 'Database', desc: 'Configure database', icon: Database },
    { id: 2, label: 'Mail Server', desc: 'Configure SMTP', icon: Mail },
    { id: 3, label: 'Administrator', desc: 'Bootstrap admin account', icon: User },
  ];

  return <SetupTimelineTemplate step={step} steps={steps} />;
};
