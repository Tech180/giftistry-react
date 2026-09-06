import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { GuestWishlistPreview } from './guest-wishlist-preview.component';
import type { Item } from 'features/items';
import type { PublicLinkPreviewWishlist } from 'features/wishlists/interfaces/public-link-preview-wishlist.interface';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: null,
    canShowAi: false,
    canShowWebSearch: false,
  }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('features/items/hooks/use-item-ai-reviews', () => ({
  useItemAiReviews: () => ({
    reviews: null,
    reviewsLoading: false,
    reviewsError: null,
  }),
}));

const wishlist: PublicLinkPreviewWishlist = {
  Id: 'list-1',
  Title: 'Birthday Gifts',
  ExpiresAt: null,
  IsActive: true,
  AllowGroupFunds: false,
  OwnerFirstName: 'Ada',
  OwnerUsername: 'ada',
};

const item: Item = {
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Headphones',
  Description: 'Noise cancelling',
  IsHiddenIdea: false,
  IsSuggestion: false,
  Category: 'electronics',
  Links: [
    {
      Id: 'link-1',
      ItemId: 'item-1',
      Url: 'https://example.com/headphones',
      RetailerName: 'Example',
      ExtractedPrice: 99,
      ExtractedImageUrl: null,
    },
  ],
  Claims: [],
  IsClaimed: false,
};

describe('GuestWishlistPreview', () => {
  test('shows the real list UI without claim, add, or owner chrome', () => {
    render(
      <MemoryRouter>
        <GuestWishlistPreview wishlist={wishlist} items={[item]} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Birthday Gifts' })).toBeInTheDocument();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('Noise cancelling')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Search ideas')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^claim$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add manually/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /import/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /discussion/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /share registry/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /back to dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Suggestion')).not.toBeInTheDocument();
  });

  test('shows View Item for guests', () => {
    render(
      <MemoryRouter>
        <GuestWishlistPreview wishlist={wishlist} items={[item]} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /view item/i })).toBeInTheDocument();
  });
});
