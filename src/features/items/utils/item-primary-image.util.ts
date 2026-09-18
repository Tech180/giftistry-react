import type { Item } from '../interfaces/item.interface';
import type { ItemPhoto } from '../interfaces/item-photo.interface';

/** Primary display image from user/scrape Photos only (by SortOrder). */
export function getItemPrimaryImageUrl(item: Item): string | null {
  const photos = item.Photos;
  if (!photos || photos.length === 0) return null;
  const sorted = [...photos].sort(
    (a: ItemPhoto, b: ItemPhoto) => a.SortOrder - b.SortOrder
  );
  const first = sorted[0];
  return first?.Url || null;
}
