import type { AiConnectionStatus } from './ai-connection-status.type';
import type { AiDefaultPromptsView } from './ai-default-prompts-view.interface';
import type { AiModelSlot } from './ai-model-slot.type';
import type { CustomPackSettings } from './custom-pack-settings.interface';
import type { LocalAiModelMode } from './local-ai-model-mode.type';
import type { ModelOption } from './model-option.interface';
import type { ModelsProvider } from './models-provider.type';
import type { PromptType } from './prompt-type.type';

export interface UseAiSettingsResult {
  aiEnabled: boolean;
  setAiEnabled: (val: boolean) => void;
  aiWebSearchEnabled: boolean;
  setAiWebSearchEnabled: (val: boolean) => void;
  aiRateLimitEnabled: boolean;
  setAiRateLimitEnabled: (val: boolean) => void;
  aiImportChunkingEnabled: boolean;
  setAiImportChunkingEnabled: (val: boolean) => void;
  aiImportChunkItemLimit: number;
  setAiImportChunkItemLimit: (val: number) => void;
  aiCompletionTimeoutMs: number;
  setAiCompletionTimeoutMs: (val: number) => void;
  aiConnectTimeoutMs: number;
  setAiConnectTimeoutMs: (val: number) => void;
  scrapeFetchTimeoutMs: number;
  setScrapeFetchTimeoutMs: (val: number) => void;
  scrapePlaywrightTimeoutMs: number;
  setScrapePlaywrightTimeoutMs: (val: number) => void;
  grabInfoConcurrency: number;
  setGrabInfoConcurrency: (val: number) => void;
  grabInfoConcurrencyUnlimited: boolean;
  setGrabInfoConcurrencyUnlimited: (val: boolean) => void;
  grabInfoActiveStreamLimit: number;
  setGrabInfoActiveStreamLimit: (val: number) => void;
  aiFastProvider: ModelsProvider;
  setAiFastProvider: (val: ModelsProvider) => void;
  aiFastEndpoint: string;
  setAiFastEndpoint: (val: string) => void;
  aiFastApiKey: string;
  setAiFastApiKey: (val: string) => void;
  aiFastModel: string;
  setAiFastModel: (val: string) => void;
  aiIntelligentProvider: ModelsProvider;
  setAiIntelligentProvider: (val: ModelsProvider) => void;
  aiIntelligentEndpoint: string;
  setAiIntelligentEndpoint: (val: string) => void;
  aiIntelligentApiKey: string;
  setAiIntelligentApiKey: (val: string) => void;
  aiIntelligentModel: string;
  setAiIntelligentModel: (val: string) => void;
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  aiDescriptionPrompt: string;
  setAiDescriptionPrompt: (val: string) => void;
  aiPopulatePrompt: string;
  setAiPopulatePrompt: (val: string) => void;
  aiCategoryPrompt: string;
  setAiCategoryPrompt: (val: string) => void;
  aiImportPrompt: string;
  setAiImportPrompt: (val: string) => void;
  aiDefaultPrompts?: AiDefaultPromptsView;
  onResetPrompt: (type: PromptType) => void;
  openrouterModels: ModelOption[];
  isLoadingModels: boolean;
  companies: string[];
  selectedFastCompany: string;
  setSelectedFastCompany: (val: string) => void;
  selectedIntelligentCompany: string;
  setSelectedIntelligentCompany: (val: string) => void;
  filteredFastModels: ModelOption[];
  filteredIntelligentModels: ModelOption[];
  localFastModels: string[];
  localIntelligentModels: string[];
  localFastModelMode: LocalAiModelMode;
  localIntelligentModelMode: LocalAiModelMode;
  onLocalModelSelection: (slot: AiModelSlot, value: string) => void;
  fastConnectionStatus: AiConnectionStatus;
  fastConnectionMessage: string;
  intelligentConnectionStatus: AiConnectionStatus;
  intelligentConnectionMessage: string;
  onTestAiConnection: (slot: AiModelSlot) => void;
  aiEnabledPackIds: string[];
  onEnabledPackIdsChange: (ids: string[]) => void;
  aiCustomPacks: CustomPackSettings[];
  onCustomPacksChange: (packs: CustomPackSettings[]) => void;
  /** Raw setters for applySettingsToState (bypass provider/endpoint change side effects). */
  forApply: {
    setAiFastProvider: (val: ModelsProvider) => void;
    setAiFastEndpoint: (val: string) => void;
    setAiIntelligentProvider: (val: ModelsProvider) => void;
    setAiIntelligentEndpoint: (val: string) => void;
    setAiDefaultPrompts: (prompts: AiDefaultPromptsView | undefined) => void;
    hydrateLocalSlotFromCache: (
      provider: ModelsProvider,
      endpoint: string,
      model: string,
      slot: AiModelSlot,
    ) => void;
  };
}
