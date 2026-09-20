import { DEFAULT_PROMPT_TOKEN_DESCRIPTION } from '../constants/default-prompt-token-description.constant';
import { PROMPT_TOKEN_INFO } from '../constants/prompt-token-info.constant';

export function getPromptTokenDescription(token: string): string {
  return PROMPT_TOKEN_INFO[token] ?? DEFAULT_PROMPT_TOKEN_DESCRIPTION;
}
