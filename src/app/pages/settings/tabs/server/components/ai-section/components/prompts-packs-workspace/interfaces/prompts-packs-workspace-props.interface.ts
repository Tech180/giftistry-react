import type { AiDefaultPromptsView } from '../../../../../interfaces/backend-settings.interface';
import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';
import type { CustomPackSettings } from '../../metadata-packs/interfaces/custom-pack-settings.interface';

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
