import type { MouseEvent } from 'react';

export interface Props {
  linkUrl: string;
  setLinkUrl: (val: string) => void;
  linkCopied: boolean;
  onCopyLink: () => void;
  readOnly?: boolean;
  canUseWebSearchOnList?: boolean;
  isAutopopulating: boolean;
  isSummarizingNotes: boolean;
  handleScrapeClick: (e: MouseEvent) => void;
  isScrapeButtonPulsing: boolean;
}
