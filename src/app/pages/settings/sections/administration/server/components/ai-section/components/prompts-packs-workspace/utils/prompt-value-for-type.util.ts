import type { PromptType } from 'features/system';
import type { PromptValues } from '../interfaces/prompt-values.interface';

export function promptValueForType(promptType: PromptType, values: PromptValues): string {
  return values[promptType];
}
