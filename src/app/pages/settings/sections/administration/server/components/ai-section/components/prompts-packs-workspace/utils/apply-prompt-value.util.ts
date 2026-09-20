import type { PromptType } from 'features/system';
import type { PromptValueSetters } from '../interfaces/prompt-value-setters.type';

export function applyPromptValue(
  promptType: PromptType,
  value: string,
  setters: PromptValueSetters
): void {
  setters[promptType](value);
}
