import React from 'react';
import type { WorkspaceViewHeaderProps } from './interfaces/workspace-view-header-props.interface';
import { WorkspaceViewHeaderTemplate } from './workspace-view-header.html';

export const WorkspaceViewHeader: React.FC<WorkspaceViewHeaderProps> = (props) => {
  return <WorkspaceViewHeaderTemplate {...props} />;
};
