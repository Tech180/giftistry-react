import type { AiDefaultPromptsView } from 'features/system';
import type { PromptType } from 'features/system';
import type { CustomPackSettings } from 'features/system';

export interface PromptsPacksWorkspaceProps {
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  aiDescriptionPrompt: string;
  setAiDescriptionPrompt: (value: string) => void;
  aiPopulatePrompt: string;
  setAiPopulatePrompt: (value: string) => void;
  aiCategoryPrompt: string;
  setAiCategoryPrompt: (value: string) => void;
  aiImportPrompt: string;
  setAiImportPrompt: (value: string) => void;
  aiDefaultPrompts?: AiDefaultPromptsView;
  onResetPrompt: (type: PromptType) => void;
  enabledPackIds: string[];
  onEnabledPackIdsChange: (ids: string[]) => void;
  customPacks: CustomPackSettings[];
  onCustomPacksChange: (packs: CustomPackSettings[]) => void;
  disabled?: boolean;
}
