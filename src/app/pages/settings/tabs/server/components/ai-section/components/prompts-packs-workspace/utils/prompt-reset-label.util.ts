import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';
import {
  DEFAULT_PROMPT_RESET_LABEL,
  POPULATE_PROMPT_RESET_LABEL,
} from '../constants/prompt-reset-label.constant';

export function promptResetLabel(promptType: PromptType): string {
  if (promptType === 'populate') return POPULATE_PROMPT_RESET_LABEL;
  return DEFAULT_PROMPT_RESET_LABEL;
}
