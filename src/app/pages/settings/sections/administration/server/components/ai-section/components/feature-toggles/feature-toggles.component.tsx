import React from 'react';
import { AI_METADATA_EXTRACTION_PRESET_OPTIONS } from 'features/system/constants/ai-metadata-extraction-preset-options.constant';
import type { AiMetadataExtractionPreset } from 'features/system';
import type { FeatureTogglesProps } from './interfaces/props.interface';
import { FeatureTogglesTemplate } from './feature-toggles.html';

export const FeatureToggles: React.FC<FeatureTogglesProps> = (props) => {
  const selectedPresetDescription = AI_METADATA_EXTRACTION_PRESET_OPTIONS.find(
    (option) => option.value === props.aiMetadataExtractionPreset,
  )?.description;

  const onMetadataExtractionPresetChange = (value: string) => {
    props.setAiMetadataExtractionPreset(value as AiMetadataExtractionPreset);
  };

  return (
    <FeatureTogglesTemplate
      aiEnabled = {
        props.aiEnabled
      }
      aiWebSearchEnabled = {
        props.aiWebSearchEnabled
      }
      setAiWebSearchEnabled = {
        props.setAiWebSearchEnabled
      }
      aiRateLimitEnabled = {
        props.aiRateLimitEnabled
      }
      setAiRateLimitEnabled = {
        props.setAiRateLimitEnabled
      }
      aiImportChunkingEnabled = {
        props.aiImportChunkingEnabled
      }
      setAiImportChunkingEnabled = {
        props.setAiImportChunkingEnabled
      }
      aiImportChunkItemLimit = {
        props.aiImportChunkItemLimit
      }
      setAiImportChunkItemLimit = {
        props.setAiImportChunkItemLimit
      }
      aiMetadataExtractionPreset = {
        props.aiMetadataExtractionPreset
      }
      setAiMetadataExtractionPreset = {
        onMetadataExtractionPresetChange
      }
      aiPageContextMaxChars = {
        props.aiPageContextMaxChars
      }
      setAiPageContextMaxChars = {
        props.setAiPageContextMaxChars
      }
      aiPopulateMaxTokens = {
        props.aiPopulateMaxTokens
      }
      setAiPopulateMaxTokens = {
        props.setAiPopulateMaxTokens
      }
      aiMetadataSplitPackCalls = {
        props.aiMetadataSplitPackCalls
      }
      setAiMetadataSplitPackCalls = {
        props.setAiMetadataSplitPackCalls
      }
      selectedPresetDescription = {
        selectedPresetDescription
      }
    />
  );
};

export default FeatureToggles;
