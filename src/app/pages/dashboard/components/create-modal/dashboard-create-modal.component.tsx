import React from 'react';
import type { DashboardCreateModalProps } from './interfaces/dashboard-create-modal-props.interface';
import { DashboardCreateModalTemplate } from './dashboard-create-modal.html';

export const DashboardCreateModal: React.FC<DashboardCreateModalProps> = (props) => (
  <DashboardCreateModalTemplate {...props} />
);
