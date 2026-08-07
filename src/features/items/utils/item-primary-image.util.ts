import type { Item } from '../interfaces/item.interface';
import type { ItemPhoto } from '../interfaces/item-photo.interface';

/** Display order: user Photos by SortOrder, then scraped link image. */
export function getItemPrimaryImageUrl(item: Item): string | null {
  const photos = item.Photos;
  if (photos && photos.length > 0) {
    const sorted = [...photos].sort(
      (a: ItemPhoto, b: ItemPhoto) => a.SortOrder - b.SortOrder
    );
    const first = sorted[0];
    if (first?.Url) return first.Url;
  }
  return item.Links?.[0]?.ExtractedImageUrl ?? null;
}
