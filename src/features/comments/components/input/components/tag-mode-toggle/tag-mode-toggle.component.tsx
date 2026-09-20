import React from 'react';
import type { Props } from './interfaces/props.interface';
import { TagModeToggleTemplate } from './tag-mode-toggle.html';

export const TagModeToggle: React.FC<Props> = ({ isActive, onToggle }) => (
  <TagModeToggleTemplate
    isActive = {
      isActive
    }
    onToggle = {
      onToggle
    }
  />
);
