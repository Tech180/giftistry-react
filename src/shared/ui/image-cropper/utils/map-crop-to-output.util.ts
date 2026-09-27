export function mapCropToOutput(
  zoom: number,
  offsetX: number,
  offsetY: number,
  ringDiameter: number,
  outputSize: number,
): { zoom: number; offsetX: number; offsetY: number } {
  if (ringDiameter <= 0) {
    return { zoom, offsetX, offsetY };
  }

  const factor = outputSize / ringDiameter;

  return {
    zoom: zoom * factor,
    offsetX: offsetX * factor,
    offsetY: offsetY * factor,
  };
}
