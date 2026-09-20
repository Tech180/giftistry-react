import type { MouseEvent } from 'react';

export interface AiTemplateProps {
  aiEnabled: boolean;
  aiWebSearchEnabled: boolean;
  onAiEnabledChange: (value: boolean) => void;
  onAiWebSearchEnabledChange: (value: boolean) => void;
  onGlowMove: (event: MouseEvent<HTMLElement>) => void;
}
