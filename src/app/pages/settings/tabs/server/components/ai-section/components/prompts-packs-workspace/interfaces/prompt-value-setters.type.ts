import type { PromptValues } from './prompt-values.interface';

export type PromptValueSetters = {
  [K in keyof PromptValues]: (value: string) => void;
};
