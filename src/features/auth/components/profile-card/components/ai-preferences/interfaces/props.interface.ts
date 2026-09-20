export interface Props {
  showAiBadge: boolean;
  aiEnabled: boolean;
  isAiSaving: boolean;
  onAiToggle: () => void;
  showWebSearchBadge: boolean;
  webSearchEnabled: boolean;
  isWebSearchSaving: boolean;
  onWebSearchToggle: () => void;
}
