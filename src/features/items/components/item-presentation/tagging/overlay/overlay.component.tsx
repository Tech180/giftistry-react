import React from 'react';
import type { Props } from './interfaces/props.interface';
import { OverlayTemplate } from './overlay.html';

export const Overlay: React.FC<Props> = ({
  isTaggingModeActive,
  onSelectTag,
}) => {
  if (!isTaggingModeActive) {
    return null;
  }

  return (
    <OverlayTemplate
      onSelectTag = {
        onSelectTag
      }
    />
  );
};
