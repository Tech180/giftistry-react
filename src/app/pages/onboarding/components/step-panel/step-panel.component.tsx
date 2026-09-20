import React from 'react';
import type { StepPanelProps } from './interfaces/step-panel-props.interface';
import { StepPanelTemplate } from './step-panel.html';

export const StepPanel: React.FC<StepPanelProps> = (props) => (
  <StepPanelTemplate {...props} />
);
