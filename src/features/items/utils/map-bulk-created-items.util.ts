import type { Item } from 'features/items/interfaces/item.interface';

export interface CreatedImportItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  priority: number | null;
  linkUrl: string | null;
  price: number | null;
  websiteName: string | null;
}

export function mapBulkCreatedItems(
  items: Item[],
  chunk: Array<{
    name: string;
    description?: string | null;
    linkUrl?: string | null;
    price?: number | null;
    category?: string | null;
    priority?: number | null;
  }>,
  failedIndexes: number[]
): CreatedImportItem[] {
  const failed = new Set(failedIndexes);
  const mapped: CreatedImportItem[] = [];
  let createdIndex = 0;

  for (let index = 0; index < chunk.length; index++) {
    if (failed.has(index)) continue;
    const created = items[createdIndex++];
    if (!created) continue;

    const payload = chunk[index];
    const link = created.Links?.[0];

    mapped.push({
      id: created.Id,
      name: created.Name || payload.name,
      description: created.Description ?? payload.description ?? null,
      category: created.Category || payload.category || 'uncategorized',
      priority: created.Priority ?? payload.priority ?? null,
      linkUrl: link?.Url ?? payload.linkUrl ?? null,
      price: link?.ExtractedPrice ?? payload.price ?? null,
      websiteName: link?.RetailerName ?? null,
    });
  }

  return mapped;
}
