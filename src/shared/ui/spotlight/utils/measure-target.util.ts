import type { SpotlightRect } from '../interfaces/spotlight-rect.interface';

export function padRect(rect: SpotlightRect, pad: number): SpotlightRect {
  return {
    top: Math.max(0, rect.top - pad),
    left: Math.max(0, rect.left - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

export function measureElement(element: Element | null): SpotlightRect | null {
  if (!element) {
    return null;
  }

  const box = element.getBoundingClientRect();
  if (box.width <= 0 && box.height <= 0) {
    return null;
  }

  return {
    top: box.top,
    left: box.left,
    width: box.width,
    height: box.height,
  };
}

/** Bounding box that covers every measurable element (e.g. name field + save button). */
export function measureElements(elements: Array<Element | null>): SpotlightRect | null {
  const rects = elements
    .map((element) => measureElement(element))
    .filter((rect): rect is SpotlightRect => rect !== null);

  if (rects.length === 0) {
    return null;
  }

  let top = Infinity;
  let left = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const rect of rects) {
    top = Math.min(top, rect.top);
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.left + rect.width);
    bottom = Math.max(bottom, rect.top + rect.height);
  }

  return {
    top,
    left,
    width: right - left,
    height: bottom - top,
  };
}
