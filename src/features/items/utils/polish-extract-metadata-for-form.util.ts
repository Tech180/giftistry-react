import { parseMoneyInput } from 'shared/utils/parse-money-input.util';
import type { ExtractMetadataResult } from '../interfaces/extract-metadata-result.interface';
import { isGenericProductTitle } from './is-generic-product-title.util';

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
  const rawTitle = compactVerboseTitle(data.Title || '');
  const title = rawTitle && !isGenericProductTitle(rawTitle) ? rawTitle : '';
  const description = data.Description?.trim() || null;
  const scrubbedDescription =
    description && /^amazon\.com\s*:/i.test(description) ? null : description;

  let price = data.Price;
  if (price != null) {
    const parsed = parseMoneyInput(String(price));
    price = parsed.ok ? parsed.value : null;
  }

  return {
    ...data,
    Title: title,
    Description: scrubbedDescription,
    Price: price,
  };
}
