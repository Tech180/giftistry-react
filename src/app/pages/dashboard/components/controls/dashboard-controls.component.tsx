import React from 'react';
import type { DashboardControlsProps } from './interfaces/dashboard-controls-props.interface';
import { DashboardControlsTemplate } from './dashboard-controls.html';

export const DashboardControls: React.FC<DashboardControlsProps> = (props) => (
  <DashboardControlsTemplate {...props} />
);
