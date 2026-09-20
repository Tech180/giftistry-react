import type { PromptHighlightSegment } from '../interfaces/prompt-highlight-segment.type';
import { splitPromptText } from '../../../utils/highlight-prompt-text.util';

export function computePromptSegments(text: string, knownTokens: string[], muted = false): PromptHighlightSegment[] {
  return splitPromptText(text).map((segment) => {
    if (segment.type !== 'token') {
      return { kind: 'text', value: segment.value };
    }

    return {
      kind: 'token',
      value: segment.value,
      known: knownTokens.includes(segment.value),
      muted,
    };
  });
}
