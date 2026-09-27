export function clampCropOffset(
  offsetX: number,
  offsetY: number,
  naturalWidth: number,
  naturalHeight: number,
  zoom: number,
  ringDiameter: number,
): { offsetX: number; offsetY: number } {
  const maxX = Math.max(0, (naturalWidth * zoom - ringDiameter) / 2);
  const maxY = Math.max(0, (naturalHeight * zoom - ringDiameter) / 2);

  return {
    offsetX: Math.min(maxX, Math.max(-maxX, offsetX)) || 0,
    offsetY: Math.min(maxY, Math.max(-maxY, offsetY)) || 0,
  };
}
