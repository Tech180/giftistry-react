import React from 'react';
import type { DashboardHeaderProps } from './interfaces/dashboard-header-props.interface';
import { DashboardHeaderTemplate } from './dashboard-header.html';

export const DashboardHeader: React.FC<DashboardHeaderProps> = (props) => (
  <DashboardHeaderTemplate {...props} />
);
