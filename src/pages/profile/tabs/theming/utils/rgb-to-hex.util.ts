/**
 * Converts an rgb(...) or rgba(...) string to its hexadecimal equivalent.
 * If the input is already a hex string, returns it directly.
 */
export const rgbToHex = (rgb: string): string => {
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return '#000000';
  const hex = rgbValues.slice(0, 3).map(x => {
    const hexVal = parseInt(x).toString(16);
    return hexVal.length === 1 ? '0' + hexVal : hexVal;
  }).join('');
  return `#${hex}`;
};

export default rgbToHex;
