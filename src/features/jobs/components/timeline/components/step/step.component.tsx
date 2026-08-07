import React from 'react';
import type { StepProps } from './interfaces/step-props.interface';
import { StepTemplate } from './step.html';

export const Step: React.FC<StepProps> = (props) => {
  return <StepTemplate {...props} />;
};
