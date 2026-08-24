import React from 'react';
import type { DeletedCommentsToggleProps } from './interfaces/deleted-comments-toggle-props.interface';
import { DeletedCommentsToggleTemplate } from './deleted-comments-toggle.html';

export const DeletedCommentsToggle: React.FC<DeletedCommentsToggleProps> = (props) => (
  <DeletedCommentsToggleTemplate {...props} />
);
