export interface FabConfirmPanelProps {
  message: string;
  tone?: 'danger' | 'warning';
  yesLabel?: string;
  noLabel?: string;
  yesDisabled?: boolean;
  onYes: () => void;
  onNo: () => void;
}
