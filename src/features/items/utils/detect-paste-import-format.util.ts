import type { ImportFileFormat } from '../interfaces/import-file-format.interface';

/**
 * Heuristic format detection for pasted import text (Giftistry dialects first).
 */
export function detectPasteImportFormat(text: string): ImportFileFormat {
  const trimmed = text.trim();
  if (!trimmed) return 'unknown';

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  if (/^WISHLIST REGISTRY:\s+\S+/im.test(trimmed) && (/=+$/m.test(trimmed) || /^\[[^\]]+\]\s*$/m.test(trimmed))) {
    return 'txt';
  }

  const hasItemHeading = /^#\s+\S+/m.test(trimmed);
  const hasMeta = /^-\s+[^:]+:\s*.+/m.test(trimmed);
  const hasWishlistTitle = /^#\s+Wishlist:\s*\S+/im.test(trimmed);
  if ((hasItemHeading && hasMeta) || (hasWishlistTitle && hasItemHeading)) {
    return 'md';
  }

  for (const line of trimmed.split(/\r?\n/)) {
    const row = line.trim();
    if (!row.includes(',') && !row.includes('\t')) {
      continue;
    }
    const delimiter = row.includes('\t') ? '\t' : ',';
    const cells = row.split(delimiter).map((cell) => cell.trim());
    if (cells.some((cell) => cell === 'Item')) {
      return 'csv';
    }
  }

  return 'unknown';
}

export function pasteFileNameForFormat(format: ImportFileFormat): string {
  switch (format) {
    case 'json':
      return 'paste.json';
    case 'txt':
      return 'paste.txt';
    case 'md':
      return 'paste.md';
    case 'csv':
      return 'paste.csv';
    default:
      return 'paste.txt';
  }
}
