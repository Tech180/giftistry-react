import type { PublicLinkPreview } from 'features/wishlists';
import { normalizeGuestPreviewItem } from 'features/wishlists';

export function normalizePreview(preview: PublicLinkPreview): PublicLinkPreview {
  return {
    ...preview,
    Items: (preview.Items ?? []).map(normalizeGuestPreviewItem),
    Groups: (preview.Groups ?? []).map((group) => ({
      ...group,
      Items: (group.Items ?? []).map(normalizeGuestPreviewItem),
    })),
  };
}
