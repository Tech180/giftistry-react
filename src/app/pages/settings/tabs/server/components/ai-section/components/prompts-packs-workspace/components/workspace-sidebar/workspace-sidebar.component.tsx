import React from 'react';
import type { WorkspaceSidebarProps } from './interfaces/workspace-sidebar-props.interface';
import { WorkspaceSidebarTemplate } from './workspace-sidebar.html';

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = (props) => {
  return <WorkspaceSidebarTemplate {...props} />;
};
