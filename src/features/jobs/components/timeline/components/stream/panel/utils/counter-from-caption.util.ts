export function counterFromCaption(
  caption: string | null | undefined,
  count: number
): string {
  if (!caption) return String(count);
  const match = caption.match(/(\d+\s*\/\s*\d+|\d+)/);
  return match?.[1]?.replace(/\s/g, '') ?? String(count);
}
