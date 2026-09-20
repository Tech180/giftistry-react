import type { AiDefaultPromptsView } from '../interfaces/ai-default-prompts-view.interface';
import type { AiPromptSetters } from '../interfaces/ai-prompt-setters.interface';
import type { BackendSettings } from '../interfaces/backend-settings.interface';
import type { PromptType } from '../interfaces/prompt-type.type';

export function effectiveAiPrompt(saved: string | undefined, fallback: string): string {
  return saved?.trim() ? saved : fallback;
}

export function applyAiPromptSettings(
  settings: BackendSettings,
  defaults: AiDefaultPromptsView,
  setters: AiPromptSetters
): void {
  setters.setAiPrompt(effectiveAiPrompt(settings.AiPrompt, defaults.Review));
  setters.setAiDescriptionPrompt(
    effectiveAiPrompt(settings.AiDescriptionPrompt, defaults.Description)
  );
  setters.setAiPopulatePrompt(effectiveAiPrompt(settings.AiPopulatePrompt, defaults.Populate));
  setters.setAiCategoryPrompt(effectiveAiPrompt(settings.AiCategoryPrompt, defaults.Category));
  setters.setAiImportPrompt(effectiveAiPrompt(settings.AiImportPrompt, defaults.Import));
}

export function getDefaultPromptForType(
  type: PromptType,
  defaults: AiDefaultPromptsView
): string {
  switch (type) {
    case 'review':
      return defaults.Review;
    case 'description':
      return defaults.Description;
    case 'populate':
      return defaults.Populate;
    case 'category':
      return defaults.Category;
    case 'import':
      return defaults.Import;
  }
}
