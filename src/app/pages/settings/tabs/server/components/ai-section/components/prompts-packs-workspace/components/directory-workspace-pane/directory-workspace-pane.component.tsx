import React from 'react';
import type { DirectoryWorkspacePaneProps } from './interfaces/directory-workspace-pane-props.interface';
import { DirectoryWorkspacePaneTemplate } from './directory-workspace-pane.html';

export const DirectoryWorkspacePane: React.FC<DirectoryWorkspacePaneProps> = (props) => {
  return <DirectoryWorkspacePaneTemplate {...props} />;
};
