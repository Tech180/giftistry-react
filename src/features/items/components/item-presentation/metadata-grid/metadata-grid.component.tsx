import React from 'react';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import type { Props } from './interfaces/props.interface';
import { MetadataGridTemplate } from './metadata-grid.html';

export const MetadataGrid: React.FC<Props> = ({
  predefinedDisplayEntries,
  userDefinedEntries,
  metadataBadgeEmoji,
  priority,
  variant = 'badges',
  compactAlign = 'start',
}) => {
  const resolvedPriority = hasPriorityValue(priority) ? priority : null;
  const showPriority = resolvedPriority !== null;

  if (predefinedDisplayEntries.length === 0 && userDefinedEntries.length === 0 && !showPriority) {
    return null;
  }

  const predefinedEntries = predefinedDisplayEntries.map((entry) => ({
    key: entry.label,
    label: entry.label,
    value: entry.value,
    emoji: metadataBadgeEmoji[entry.label],
  }));

  const preparedUserEntries = userDefinedEntries.map((field) => ({
    key: field.name,
    label: field.name,
    value: field.value,
  }));

  return (
    <MetadataGridTemplate
      variant = {
        variant
      }
      compactAlign = {
        compactAlign
      }
      showPriority = {
        showPriority
      }
      priority = {
        resolvedPriority
      }
      predefinedEntries = {
        predefinedEntries
      }
      userDefinedEntries = {
        preparedUserEntries
      }
    />
  );
};
