import type { AiMetadataExtractionPreset } from 'features/system';

export interface FeatureTogglesTemplateProps {
  aiEnabled: boolean;
  aiWebSearchEnabled: boolean;
  setAiWebSearchEnabled: (value: boolean) => void;
  aiRateLimitEnabled: boolean;
  setAiRateLimitEnabled: (value: boolean) => void;
  aiImportChunkingEnabled: boolean;
  setAiImportChunkingEnabled: (value: boolean) => void;
  aiImportChunkItemLimit: number;
  setAiImportChunkItemLimit: (value: number) => void;
  aiMetadataExtractionPreset: AiMetadataExtractionPreset;
  setAiMetadataExtractionPreset: (value: string) => void;
  aiPageContextMaxChars: number;
  setAiPageContextMaxChars: (value: number) => void;
  aiPopulateMaxTokens: number;
  setAiPopulateMaxTokens: (value: number) => void;
  aiMetadataSplitPackCalls: boolean;
  setAiMetadataSplitPackCalls: (value: boolean) => void;
  selectedPresetDescription?: string;
}
