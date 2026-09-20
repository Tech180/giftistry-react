import React from 'react';
import type { PromptWorkspaceIconTemplateProps } from './interfaces/template-props.interface';

export const WorkspacePromptIconTemplate: React.FC<PromptWorkspaceIconTemplateProps> = ({
  Icon,
  size,
}) => {
  return <Icon size={size} aria-hidden="true" />;
};
