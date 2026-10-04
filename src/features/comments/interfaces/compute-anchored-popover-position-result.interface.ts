import type { PopoverPlacement } from '../hooks/interfaces/popover-placement.type';

export interface ComputeAnchoredPopoverPositionResult {
  placement: PopoverPlacement;
  top: number;
  left: number;
  maxHeight: number;
  constrainMaxHeight: boolean;
}
