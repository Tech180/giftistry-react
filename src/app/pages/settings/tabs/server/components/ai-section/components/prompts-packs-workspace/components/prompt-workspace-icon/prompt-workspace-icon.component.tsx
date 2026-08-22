import React from 'react';
import { PROMPT_WORKSPACE_ICON_COMPONENTS } from '../../constants/prompt-workspace-icon-components.constant';
import type { PromptWorkspaceIconProps } from './interfaces/prompt-workspace-icon-props.interface';
import { WorkspacePromptIconTemplate } from './prompt-workspace-icon.html';

export const WorkspacePromptIcon: React.FC<PromptWorkspaceIconProps> = ({ icon, size = 16 }) => {
  return <WorkspacePromptIconTemplate Icon={PROMPT_WORKSPACE_ICON_COMPONENTS[icon]} size={size} />;
};
