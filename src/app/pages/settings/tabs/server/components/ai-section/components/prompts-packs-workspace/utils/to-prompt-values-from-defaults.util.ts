import type { AiDefaultPromptsView } from '../../../../../interfaces/backend-settings.interface';
import type { PromptValues } from '../interfaces/prompt-values.interface';

export function toPromptValuesFromDefaults(defaults: AiDefaultPromptsView): PromptValues {
  return {
    review: defaults.Review,
    description: defaults.Description,
    populate: defaults.Populate,
    category: defaults.Category,
    import: defaults.Import,
  };
}
