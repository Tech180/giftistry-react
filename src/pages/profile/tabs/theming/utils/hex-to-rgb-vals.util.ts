/**
 * Converts a hex color string to its comma-separated red, green, blue values.
 * Example: "#5e6ad2" -> "94, 106, 210"
 */
export const hexToRgbVals = (hex: string): string => {
  if (!hex) return '0,0,0';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
};

export default hexToRgbVals;
