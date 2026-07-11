export type PromptTextSegment = {
  type: 'text' | 'token';
  value: string;
};

const PROMPT_TOKEN_PATTERN = /(\{[a-zA-Z]+\})/g;
const PROMPT_TOKEN_EXACT = /^\{[a-zA-Z]+\}$/;

export function splitPromptText(text: string): PromptTextSegment[] {
  if (!text) return [];

  return text
    .split(PROMPT_TOKEN_PATTERN)
    .filter((part) => part.length > 0)
    .map((part) => ({
      type: PROMPT_TOKEN_EXACT.test(part) ? 'token' : 'text',
      value: part,
    }));
}

export function countPromptLines(text: string, minLines = 1): number {
  const lines = text.split('\n').length;
  return Math.max(minLines, lines);
}
