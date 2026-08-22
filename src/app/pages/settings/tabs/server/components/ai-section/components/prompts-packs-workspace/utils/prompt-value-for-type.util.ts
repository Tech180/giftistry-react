import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';
import type { PromptValues } from '../interfaces/prompt-values.interface';

export function promptValueForType(promptType: PromptType, values: PromptValues): string {
  return values[promptType];
}
