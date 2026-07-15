export const POPULATE_HUB_HEADERS = {
  populate: '=== Populate Prompt ===',
  description: '=== Description ===',
  category: '=== Category ===',
} as const;

const POPULATE_HUB_HEADER_PATTERN = /^=== (.+) ===$/;

export function parsePopulateHubHeaderLine(line: string): string | null {
  const match = line.trim().match(POPULATE_HUB_HEADER_PATTERN);
  return match?.[1] ?? null;
}

export function assemblePopulateHubPrompt(
  populateBody: string,
  descriptionPrompt: string,
  categoryPrompt: string
): string {
  return `${POPULATE_HUB_HEADERS.populate}
${populateBody.trim()}

${POPULATE_HUB_HEADERS.description}
${descriptionPrompt.trim()}

${POPULATE_HUB_HEADERS.category}
${categoryPrompt.trim()}`;
}

export function parsePopulateHubPrompt(combined: string): {
  populate: string;
  description: string;
  category: string;
} | null {
  const descriptionMarker = `\n${POPULATE_HUB_HEADERS.description}\n`;
  const categoryMarker = `\n${POPULATE_HUB_HEADERS.category}\n`;
  const populatePrefix = `${POPULATE_HUB_HEADERS.populate}\n`;

  const descIdx = combined.indexOf(descriptionMarker);
  const catIdx = combined.indexOf(categoryMarker);
  if (descIdx === -1 || catIdx === -1 || catIdx <= descIdx) {
    return null;
  }

  const populateStart = combined.startsWith(populatePrefix) ? populatePrefix.length : 0;
  const populate = combined.slice(populateStart, descIdx).trim();
  const description = combined
    .slice(descIdx + descriptionMarker.length, catIdx)
    .trim();
  const category = combined.slice(catIdx + categoryMarker.length).trim();

  return { populate, description, category };
}

export function getPopulateHubReadOnlyStartIndex(combined: string): number | null {
  const marker = `\n${POPULATE_HUB_HEADERS.description}\n`;
  const idx = combined.indexOf(marker);
  return idx === -1 ? null : idx;
}

export function extractPopulateBodyFromCombined(combined: string): string {
  const parsed = parsePopulateHubPrompt(combined);
  if (parsed) return parsed.populate;

  const descriptionMarker = `\n${POPULATE_HUB_HEADERS.description}\n`;
  const descIdx = combined.indexOf(descriptionMarker);
  if (descIdx !== -1) {
    const populateStart = combined.startsWith(`${POPULATE_HUB_HEADERS.populate}\n`)
      ? `${POPULATE_HUB_HEADERS.populate}\n`.length
      : 0;
    return combined.slice(populateStart, descIdx).trim();
  }

  return combined.trim();
}
