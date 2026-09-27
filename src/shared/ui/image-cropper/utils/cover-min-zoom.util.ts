export function coverMinZoom(naturalWidth: number, naturalHeight: number, ringDiameter: number): number {
  if (naturalWidth <= 0 || naturalHeight <= 0 || ringDiameter <= 0) {
    return 1;
  }

  return ringDiameter / Math.min(naturalWidth, naturalHeight);
}
