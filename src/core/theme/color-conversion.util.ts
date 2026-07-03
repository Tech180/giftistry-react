export function hexToRgbComma(hex: string): string {
  if (!hex) return '0,0,0';
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0,0,0';
}

export function rgbToHex(rgb: string): string {
  if (!rgb) return '#000000';
  if (rgb.startsWith('#')) return rgb;
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return '#000000';
  const hex = rgbValues.slice(0, 3).map((x) => {
    const hexVal = parseInt(x, 10).toString(16);
    return hexVal.length === 1 ? `0${hexVal}` : hexVal;
  }).join('');
  return `#${hex}`;
}

/** @deprecated Use hexToRgbComma */
export const hexToRgb = hexToRgbComma;

/** @deprecated Use hexToRgbComma */
export const hexToRgbVals = hexToRgbComma;
