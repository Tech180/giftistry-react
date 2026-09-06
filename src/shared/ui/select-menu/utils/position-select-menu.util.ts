import type { PositionSelectMenuInput } from '../interfaces/position-select-menu-input.interface';
import type { PositionSelectMenuResult } from '../interfaces/position-select-menu-result.interface';

const DEFAULT_GAP = 6;
const DEFAULT_INSET = 12;

/** Centers the menu under the trigger, flips above when clipped, clamps to viewport. */
export function positionSelectMenu(input: PositionSelectMenuInput): PositionSelectMenuResult {
  const gap = input.gap ?? DEFAULT_GAP;
  const inset = input.inset ?? DEFAULT_INSET;
  const { triggerRect, menuWidth, menuHeight, viewportWidth, viewportHeight } = input;

  let top = triggerRect.bottom + gap;
  let left = triggerRect.left + triggerRect.width / 2 - menuWidth / 2;
  let transformOrigin: PositionSelectMenuResult['transformOrigin'] = 'center top';

  if (left < inset) {
    left = inset;
  }
  if (left + menuWidth > viewportWidth - inset) {
    left = Math.max(inset, viewportWidth - menuWidth - inset);
  }

  if (top + menuHeight > viewportHeight - inset) {
    top = triggerRect.top - menuHeight - gap;
    transformOrigin = 'center bottom';
  }

  return { top, left, transformOrigin };
}
