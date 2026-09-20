import React from 'react';
import type { Props } from './interfaces/props.interface';
import { SelectTemplate } from './select.html';

export const Select: React.FC<Props> = ({
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
  showInlineSelect = true,
}) => {
  if (!isTaggingModeActive || !showInlineSelect) {
    return null;
  }

  return (
    <SelectTemplate
      isTaggedSelection = {
        isTaggedSelection
      }
      onSelectTag = {
        onSelectTag
      }
    />
  );
};
