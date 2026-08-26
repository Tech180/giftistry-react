import type { Item } from '../interfaces/item.interface';
import {
  GIFTISTRY_MD_CATEGORY_LABEL,
  GIFTISTRY_MD_CUSTOM_FIELDS_HEADING,
  GIFTISTRY_MD_FAVORITE_LABEL,
  GIFTISTRY_MD_LINK_LABEL,
  GIFTISTRY_MD_PRICE_LABEL,
  GIFTISTRY_MD_PRIORITY_LABEL,
  GIFTISTRY_MD_QUANTITY_LABEL,
  GIFTISTRY_MD_RETAILER_LABEL,
} from '../constants/giftistry-markdown.constant';
import { parseItemDescription } from 'shared/utils/parse-item-description.util';

function metaLine(label: string, value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null;
  return `- ${label}: ${value}`;
}

/**
 * Serializes an item to the Giftistry Markdown dialect used by import.
 */
export function formatItemAsGiftistryMarkdown(item: Item): string {
  const lines: string[] = [];
  const name = item.Name?.trim() || 'Untitled item';
  lines.push(`# ${name}`, '');

  const category = (item.CategoryLabel || item.Category || '').trim();
  if (category && category.toLowerCase() !== 'uncategorized') {
    const line = metaLine(GIFTISTRY_MD_CATEGORY_LABEL, category);
    if (line) lines.push(line);
  }

  if (item.Priority !== null && item.Priority !== undefined) {
    const line = metaLine(GIFTISTRY_MD_PRIORITY_LABEL, item.Priority);
    if (line) lines.push(line);
  }

  const isFavorite = item.Metadata?.IsFavorite === true;
  lines.push(
    metaLine(GIFTISTRY_MD_FAVORITE_LABEL, isFavorite ? 'yes' : 'no')!
  );

  const quantity = item.DesiredQuantity ?? item.Metadata?.DesiredQuantity ?? null;
  if (quantity != null && quantity >= 2) {
    const line = metaLine(GIFTISTRY_MD_QUANTITY_LABEL, quantity);
    if (line) lines.push(line);
  }

  const primaryLink = item.Links?.[0];
  if (primaryLink) {
    if (primaryLink.ExtractedPrice != null) {
      const line = metaLine(GIFTISTRY_MD_PRICE_LABEL, primaryLink.ExtractedPrice);
      if (line) lines.push(line);
    }
    if (primaryLink.Url?.trim()) {
      const line = metaLine(GIFTISTRY_MD_LINK_LABEL, primaryLink.Url.trim());
      if (line) lines.push(line);
    }
    if (primaryLink.RetailerName?.trim()) {
      const line = metaLine(GIFTISTRY_MD_RETAILER_LABEL, primaryLink.RetailerName.trim());
      if (line) lines.push(line);
    }
  }

  lines.push('');

  const parsed = parseItemDescription(item.Description);
  const descriptionText =
    (item.Metadata?.Text ?? parsed.text ?? (!parsed.isJson ? item.Description : null))?.trim() ||
    '';
  if (descriptionText) {
    lines.push(descriptionText, '');
  }

  const predefined = item.Metadata?.CustomFields?.Predefined ?? {};
  const userDefined = item.Metadata?.CustomFields?.UserDefined ?? {};
  const customEntries: Array<[string, string]> = [
    ...Object.entries(predefined)
      .filter(([, v]) => v != null && String(v).trim())
      .map(([k, v]) => [k, String(v).trim()] as [string, string]),
    ...Object.entries(userDefined)
      .filter(([, v]) => v != null && String(v).trim())
      .map(([k, v]) => [k, String(v).trim()] as [string, string]),
  ];

  if (customEntries.length > 0) {
    lines.push(`## ${GIFTISTRY_MD_CUSTOM_FIELDS_HEADING}`);
    for (const [key, value] of customEntries) {
      lines.push(`- ${key}: ${value}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}
