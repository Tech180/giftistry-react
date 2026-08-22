import type { PublicLinkPreviewWishlist } from '../interfaces/public-link-preview-wishlist.interface';
import type { Wishlist } from '../interfaces/wishlist.interface';

export function toGuestWishlist(preview: PublicLinkPreviewWishlist): Wishlist {
  return {
    Id: preview.Id,
    UserId: '',
    Title: preview.Title,
    ExpiresAt: preview.ExpiresAt,
    AllowGroupFunds: preview.AllowGroupFunds,
    IsActive: preview.IsActive,
    Category: preview.Category,
    OwnerUsername: preview.OwnerUsername,
    OwnerFirstName: preview.OwnerFirstName,
    OwnerAvatar: preview.OwnerAvatar ?? null,
    Role: 'viewer',
    AiEnabled: false,
    WebSearchEnabled: false,
    ManualJobBackground: true,
    AutoRollover: false,
  };
}
