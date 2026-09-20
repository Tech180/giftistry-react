import React from 'react';
import type { FeatureTogglesProps } from './interfaces/props.interface';
import { FeatureTogglesTemplate } from './feature-toggles.html';

export const FeatureToggles: React.FC<FeatureTogglesProps> = ({
  aiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiImportChunkingEnabled,
  setAiImportChunkingEnabled,
  aiImportChunkItemLimit,
  setAiImportChunkItemLimit,
}) => (
  <FeatureTogglesTemplate
    aiEnabled = {
      aiEnabled
    }
    aiWebSearchEnabled = {
      aiWebSearchEnabled
    }
    setAiWebSearchEnabled = {
      setAiWebSearchEnabled
    }
    aiRateLimitEnabled = {
      aiRateLimitEnabled
    }
    setAiRateLimitEnabled = {
      setAiRateLimitEnabled
    }
    aiImportChunkingEnabled = {
      aiImportChunkingEnabled
    }
    setAiImportChunkingEnabled = {
      setAiImportChunkingEnabled
    }
    aiImportChunkItemLimit = {
      aiImportChunkItemLimit
    }
    setAiImportChunkItemLimit = {
      setAiImportChunkItemLimit
    }
  />
);

export default FeatureToggles;
