export function clampZoom(zoom: number, minZoom: number, maxZoom: number): number {
  return Math.min(maxZoom, Math.max(minZoom, zoom));
}
