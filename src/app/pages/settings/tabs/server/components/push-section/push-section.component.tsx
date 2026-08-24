import React from 'react';
import type { PushSectionProps } from '../../interfaces/push-section-props.interface';
import { PushSectionTemplate } from './push-section.html';

export const PushSection: React.FC<PushSectionProps> = (props) => {
  return <PushSectionTemplate {...props} />;
};
