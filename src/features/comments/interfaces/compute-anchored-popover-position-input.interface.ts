export interface ComputeAnchoredPopoverPositionInput {
  anchorRect: Pick<DOMRect, 'top' | 'bottom' | 'left'>;
  popoverWidth: number;
  popoverHeight: number;
  gap: number;
  viewportPadding: number;
  viewportWidth: number;
  viewportHeight: number;
}
