import React from 'react';
import type { PromptWorkspacePaneProps } from './interfaces/props.interface';
import { PromptWorkspacePaneTemplate } from './prompt-workspace-pane.html';

export const PromptWorkspacePane: React.FC<PromptWorkspacePaneProps> = (props) => {
  return <PromptWorkspacePaneTemplate {...props} />;
};
