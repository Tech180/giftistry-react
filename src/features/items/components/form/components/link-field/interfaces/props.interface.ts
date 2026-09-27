import type { MouseEvent } from 'react';

export interface Props {
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  onOpenLink: () => void;
  readOnly?: boolean;
  canUseWebSearchOnList?: boolean;
  isAutopopulating: boolean;
  isSummarizingNotes: boolean;
  handleScrapeClick: (e: MouseEvent) => void;
  isScrapeButtonPulsing: boolean;
}
