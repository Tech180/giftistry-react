import { parsePopulateHubHeaderLine } from 'features/system';
import type { PromptHighlightNode } from '../interfaces/prompt-highlight-node.type';
import { computePromptSegments } from './compute-prompt-segments.util';

export function computeHighlightNodes(
  text: string,
  knownTokens: string[],
  placeholder: string | undefined,
  readOnlyFromIndex: number | null,
  showSectionDividers: boolean
): PromptHighlightNode[] {
  if (!text.trim() && placeholder) {
    return [{ kind: 'placeholder', text: placeholder }];
  }

  if (showSectionDividers) {
    const lines = text.split('\n');
    let charOffset = 0;
    const nodes: PromptHighlightNode[] = [];

    lines.forEach((line, lineIndex) => {
      const lineStart = charOffset;
      charOffset += line.length + (lineIndex < lines.length - 1 ? 1 : 0);

      const headerTitle = parsePopulateHubHeaderLine(line);
      const isReadOnly =
        readOnlyFromIndex != null &&
        readOnlyFromIndex >= 0 &&
        lineStart >= readOnlyFromIndex;

      if (headerTitle) {
        nodes.push({
          kind: 'divider',
          key: `divider-${lineIndex}`,
          title: headerTitle,
          readOnly: isReadOnly,
        });
        return;
      }

      nodes.push({
        kind: 'line',
        key: `line-${lineIndex}`,
        readOnly: isReadOnly,
        segments: computePromptSegments(line, knownTokens, isReadOnly),
        trailingNewline: lineIndex < lines.length - 1,
      });
    });

    return nodes;
  }

  const hasLockedTail =
    readOnlyFromIndex != null && readOnlyFromIndex >= 0 && readOnlyFromIndex < text.length;

  if (!hasLockedTail) {
    return [{ kind: 'block', key: 'segment', segments: computePromptSegments(text, knownTokens) }];
  }

  return [
    {
      kind: 'block',
      key: 'editable',
      segments: computePromptSegments(text.slice(0, readOnlyFromIndex), knownTokens),
    },
    {
      kind: 'block',
      key: 'readonly',
      segments: computePromptSegments(text.slice(readOnlyFromIndex), knownTokens, true),
      muted: true,
    },
  ];
}
