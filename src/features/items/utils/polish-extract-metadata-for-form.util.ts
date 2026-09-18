import type { ExtractMetadataResult } from '../interfaces/extract-metadata-result.interface';

function compactVerboseTitle(title: string): string {
  const trimmed = title.replace(/\s+/g, ' ').trim();
  if (!trimmed || trimmed.length <= 80) return trimmed;
  const first = trimmed.split(/\s*[,|]\s*/)[0]?.trim() || trimmed;
  return first.replace(/\s+[-–—]\s+.*$/, '').trim() || first;
}

/**
 * Client-side guard so marketplace SEO titles/meta descriptions never stick
 * in the add-item form if a job still returns scrape-raw fields.
 */
export function polishExtractMetadataForForm(
  data: ExtractMetadataResult
): ExtractMetadataResult {
  const title = compactVerboseTitle(data.Title || '');
  const description = data.Description?.trim() || null;
  const scrubbedDescription =
    description && /^amazon\.com\s*:/i.test(description) ? null : description;

  return {
    ...data,
    Title: title,
    Description: scrubbedDescription,
  };
}
