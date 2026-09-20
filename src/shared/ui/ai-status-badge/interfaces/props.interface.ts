import type { Size } from './size.type';

export interface Props {
  enabled: boolean;
  size?: Size;
  label?: string;
  onToggle?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelEnabled?: string;
  ariaLabelDisabled?: string;
}

/** @deprecated Prefer `Props`; kept for barrel consumers. */
export type AiStatusBadgeProps = Props;
export type AiStatusBadgeSize = Size;
