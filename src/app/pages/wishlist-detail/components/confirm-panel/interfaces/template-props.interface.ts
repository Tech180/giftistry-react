export interface TemplateProps {
  message: string;
  tone: 'danger' | 'warning' | 'primary';
  yesLabel: string;
  noLabel: string;
  yesDisabled: boolean;
  onYes: () => void;
  onNo: () => void;
}
