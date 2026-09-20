import React from 'react';
import type { Props } from './interfaces/props.interface';
import { AiPreferencesTemplate } from './ai-preferences.html';

export const AiPreferences: React.FC<Props> = ({
  showAiBadge,
  aiEnabled,
  isAiSaving,
  onAiToggle,
  showWebSearchBadge,
  webSearchEnabled,
  isWebSearchSaving,
  onWebSearchToggle,
}) => {
  if (!showAiBadge && !showWebSearchBadge) {
    return null;
  }

  return (
    <AiPreferencesTemplate
      showAiBadge = {
        showAiBadge
      }
      aiEnabled = {
        aiEnabled
      }
      isAiSaving = {
        isAiSaving
      }
      onAiToggle = {
        onAiToggle
      }
      showWebSearchBadge = {
        showWebSearchBadge
      }
      webSearchEnabled = {
        webSearchEnabled
      }
      isWebSearchSaving = {
        isWebSearchSaving
      }
      onWebSearchToggle = {
        onWebSearchToggle
      }
    />
  );
};
