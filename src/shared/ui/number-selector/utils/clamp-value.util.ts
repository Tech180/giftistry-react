export const clampValue = (
  value: number,
  min: number,
  max: number | undefined
): number => {
  const lower = Math.max(min, value);
  return typeof max === 'number' ? Math.min(max, lower) : lower;
};
