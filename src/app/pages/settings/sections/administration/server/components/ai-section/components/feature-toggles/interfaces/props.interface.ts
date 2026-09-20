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
}
