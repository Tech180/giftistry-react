export function getInputWidth(val: string): string {
  const stringVal = val || '';
  const charWidth = 7.8;
  const minWidth = 12;
  return `${Math.max(stringVal.length * charWidth + 10, minWidth)}px`;
}
