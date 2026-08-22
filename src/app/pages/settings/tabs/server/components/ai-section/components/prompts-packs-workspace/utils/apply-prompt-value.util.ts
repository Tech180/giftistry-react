import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';
import type { PromptValueSetters } from '../interfaces/prompt-value-setters.type';

export function applyPromptValue(
  promptType: PromptType,
  value: string,
  setters: PromptValueSetters
): void {
  setters[promptType](value);
}
