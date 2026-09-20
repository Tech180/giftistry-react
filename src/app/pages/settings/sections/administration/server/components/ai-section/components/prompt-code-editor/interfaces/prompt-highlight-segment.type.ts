export type PromptHighlightSegment =
  | { kind: 'text'; value: string }
  | { kind: 'token'; value: string; known: boolean; muted: boolean };
