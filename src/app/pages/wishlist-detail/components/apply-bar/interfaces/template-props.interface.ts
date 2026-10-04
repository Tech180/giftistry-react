import type { ApplyBarButtonLabel } from '../../../interfaces/resolve-apply-bar-button-label-input.interface';

export interface TemplateProps {
  buttonLabel: ApplyBarButtonLabel;
  onApply: () => void;
}
