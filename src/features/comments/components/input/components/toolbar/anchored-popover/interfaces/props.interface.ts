import type { UseAnchoredPopoverOptions } from '../../../../../../hooks/interfaces/use-anchored-popover-options.interface';

export interface Props extends UseAnchoredPopoverOptions {
  anchorRef: React.RefObject<HTMLElement | null>;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
}
