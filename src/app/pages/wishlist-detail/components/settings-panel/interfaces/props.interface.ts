export interface Props {
  aiEnabled: boolean;
  webSearchEnabled: boolean;
  manualJobBackground: boolean;
  autoRollover: boolean;
  allowGroupFunds: boolean;
  canShowAi: boolean;
  canShowWebSearch: boolean;
  onToggleAi: () => void;
  onToggleWebSearch: () => void;
  onToggleManualJobBackground: () => void;
  onToggleAutoRollover: () => void;
  onToggleAllowGroupFunds: () => void;
  /** When true, settings are visible but not editable (viewers / collaborators / archived). */
  readOnly?: boolean;
}
