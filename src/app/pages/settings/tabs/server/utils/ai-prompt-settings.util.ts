import type { AiDefaultPromptsView, BackendSettings } from '../interfaces/backend-settings.interface';

export type PromptType = 'review' | 'description' | 'populate' | 'category';

export function effectiveAiPrompt(saved: string | undefined, fallback: string): string {
  return saved?.trim() ? saved : fallback;
}

export function applyAiPromptSettings(
  settings: BackendSettings,
  defaults: AiDefaultPromptsView,
  setters: {
    setAiPrompt: (value: string) => void;
    setAiDescriptionPrompt: (value: string) => void;
    setAiPopulatePrompt: (value: string) => void;
    setAiCategoryPrompt: (value: string) => void;
  }
): void {
  setters.setAiPrompt(effectiveAiPrompt(settings.AiPrompt, defaults.Review));
  setters.setAiDescriptionPrompt(
    effectiveAiPrompt(settings.AiDescriptionPrompt, defaults.Description)
  );
  setters.setAiPopulatePrompt(effectiveAiPrompt(settings.AiPopulatePrompt, defaults.Populate));
  setters.setAiCategoryPrompt(effectiveAiPrompt(settings.AiCategoryPrompt, defaults.Category));
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
  }
}
