import type { FloatingAction } from './floating-action.interface';

export interface FloatingActionMenuProps {
  actions: FloatingAction[];
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  ariaLabel?: string;
  className?: string;
  /** Optional tour spotlight target on the closed-face button. */
  closedTourTarget?: string;
}
