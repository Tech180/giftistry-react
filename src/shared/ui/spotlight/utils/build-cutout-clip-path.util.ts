import type { SpotlightRect } from '../interfaces/spotlight-rect.interface';

/** Full-viewport evenodd clip-path that punches rectangular holes through the overlay. */
export function buildCutoutClipPath(holes: SpotlightRect[], viewportWidth: number, viewportHeight: number): string {
  const outer = `M0 0H${viewportWidth}V${viewportHeight}H0Z`;
  const cutouts = holes
    .filter((hole) => hole.width > 0 && hole.height > 0)
    .map((hole) => {
      const right = hole.left + hole.width;
      const bottom = hole.top + hole.height;
      return `M${hole.left} ${hole.top}H${right}V${bottom}H${hole.left}Z`;
    })
    .join('');

  return `path(evenodd, "${outer}${cutouts}")`;
}
