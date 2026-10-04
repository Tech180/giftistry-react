import type { ComputeAnchoredPopoverPositionInput } from '../interfaces/compute-anchored-popover-position-input.interface';
import type { ComputeAnchoredPopoverPositionResult } from '../interfaces/compute-anchored-popover-position-result.interface';
import type { PopoverPlacement } from '../hooks/interfaces/popover-placement.type';

export function computeAnchoredPopoverPosition(
  input: ComputeAnchoredPopoverPositionInput
): ComputeAnchoredPopoverPositionResult {
  const {
    anchorRect,
    popoverWidth,
    popoverHeight,
    gap,
    viewportPadding,
    viewportWidth,
    viewportHeight,
  } = input;

  const spaceBelow = viewportHeight - anchorRect.bottom - viewportPadding;
  const spaceAbove = anchorRect.top - viewportPadding;

  const placement: PopoverPlacement =
    spaceBelow >= popoverHeight + gap || spaceBelow >= spaceAbove ? 'below' : 'above';

  const maxHeight = Math.max(0, placement === 'below' ? spaceBelow - gap : spaceAbove - gap);
  const layoutHeight = maxHeight > 0 ? Math.min(popoverHeight, maxHeight) : popoverHeight;

  let top =
    placement === 'below' ? anchorRect.bottom + gap : anchorRect.top - popoverHeight - gap;

  let left = anchorRect.left;

  if (left + popoverWidth > viewportWidth - viewportPadding) {
    left = viewportWidth - popoverWidth - viewportPadding;
  }

  if (left < viewportPadding) {
    left = viewportPadding;
  }

  if (top + layoutHeight > viewportHeight - viewportPadding) {
    top = viewportHeight - viewportPadding - layoutHeight;
  }

  if (top < viewportPadding) {
    top = viewportPadding;
  }

  return {
    placement,
    top,
    left,
    maxHeight,
    constrainMaxHeight: popoverHeight > maxHeight && maxHeight > 0,
  };
}
