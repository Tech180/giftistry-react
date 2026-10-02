import type { AiMetadataExtractionPreset } from 'features/system';

export interface FeatureTogglesProps {
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
  setAiMetadataExtractionPreset: (value: AiMetadataExtractionPreset) => void;
  aiPageContextMaxChars: number;
  setAiPageContextMaxChars: (value: number) => void;
  aiPopulateMaxTokens: number;
  setAiPopulateMaxTokens: (value: number) => void;
  aiMetadataSplitPackCalls: boolean;
  setAiMetadataSplitPackCalls: (value: boolean) => void;
}
