import type { SpotlightPlacement } from '../interfaces/spotlight-props.interface';
import type { SpotlightRect } from '../interfaces/spotlight-rect.interface';

const VIEW_PAD = 16;
const GAP = 12;

export interface CardSize {
  width: number;
  height: number;
}

export interface CardPosition {
  top: number;
  left: number;
  placement: SpotlightPlacement;
}

/** Prefer the requested side; flip/clamp so the card stays in view and clear of the hole. */
export function resolveCardPosition(
  hole: SpotlightRect,
  preferred: SpotlightPlacement,
  card: CardSize,
  viewport: { width: number; height: number } = typeof window === 'undefined'
    ? { width: 1280, height: 720 }
    : { width: window.innerWidth, height: window.innerHeight }
): CardPosition {
  if (preferred === 'center') {
    return {
      top: Math.max(VIEW_PAD, (viewport.height - card.height) / 2),
      left: Math.max(VIEW_PAD, (viewport.width - card.width) / 2),
      placement: 'center',
    };
  }

  const order = placementFallbacks(preferred);
  for (const placement of order) {
    const candidate = positionFor(placement, hole, card, viewport);
    if (candidate && fitsViewport(candidate, card, viewport) && !overlapsHole(candidate, card, hole)) {
      return { ...candidate, placement };
    }
  }

  const fallback = positionFor(preferred, hole, card, viewport) ?? {
    top: VIEW_PAD,
    left: VIEW_PAD,
  };
  return {
    top: clamp(fallback.top, VIEW_PAD, viewport.height - card.height - VIEW_PAD),
    left: clamp(fallback.left, VIEW_PAD, viewport.width - card.width - VIEW_PAD),
    placement: preferred,
  };
}

function placementFallbacks(preferred: SpotlightPlacement): SpotlightPlacement[] {
  if (preferred === 'bottom') {
    return ['bottom', 'top', 'right', 'left'];
  }

  if (preferred === 'top') {
    return ['top', 'bottom', 'right', 'left'];
  }

  if (preferred === 'left') {
    return ['left', 'right', 'bottom', 'top'];
  }

  if (preferred === 'right') {
    return ['right', 'left', 'bottom', 'top'];
  }

  return ['center'];
}

function positionFor(
  placement: SpotlightPlacement,
  hole: SpotlightRect,
  card: CardSize,
  viewport: { width: number; height: number }
): { top: number; left: number } | null {
  const maxLeft = viewport.width - card.width - VIEW_PAD;
  const alignedLeft = clamp(hole.left + (hole.width - card.width) / 2, VIEW_PAD, maxLeft);

  if (placement === 'bottom') {
    return { top: hole.top + hole.height + GAP, left: alignedLeft };
  }

  if (placement === 'top') {
    return { top: hole.top - GAP - card.height, left: alignedLeft };
  }

  if (placement === 'left') {
    return {
      top: clamp(hole.top, VIEW_PAD, viewport.height - card.height - VIEW_PAD),
      left: hole.left - GAP - card.width,
    };
  }

  if (placement === 'right') {
    return {
      top: clamp(hole.top, VIEW_PAD, viewport.height - card.height - VIEW_PAD),
      left: hole.left + hole.width + GAP,
    };
  }

  return null;
}

function fitsViewport(
  pos: { top: number; left: number },
  card: CardSize,
  viewport: { width: number; height: number }
): boolean {
  return (
    pos.top >= VIEW_PAD &&
    pos.left >= VIEW_PAD &&
    pos.top + card.height <= viewport.height - VIEW_PAD &&
    pos.left + card.width <= viewport.width - VIEW_PAD
  );
}

function overlapsHole(pos: { top: number; left: number }, card: CardSize, hole: SpotlightRect): boolean {
  const cardRight = pos.left + card.width;
  const cardBottom = pos.top + card.height;
  const holeRight = hole.left + hole.width;
  const holeBottom = hole.top + hole.height;
  return !(cardRight <= hole.left || pos.left >= holeRight || cardBottom <= hole.top || pos.top >= holeBottom);
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
