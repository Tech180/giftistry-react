import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Item } from 'features/items';
import type { PublicLinkPreviewWishlist } from 'features/wishlists/interfaces/public-link-preview-wishlist.interface';
import { OVERLAY_BREAKPOINT_MEDIA_QUERY } from 'app/pages/wishlist-detail/constants/overlay-breakpoint.constant';
import { ToastProvider } from 'shared/providers/toast';

const getPageClassNameMock = vi.fn(
  (isItemDrawerVisible: boolean, viewMode: string, isCommentsOpen: boolean) =>
    `page ${isItemDrawerVisible ? 'page--add-open' : ''} ${viewMode} ${isCommentsOpen ? 'page--comments-open' : ''}`.trim()
);

vi.mock('app/pages/wishlist-detail/utils/get-page-class-name.util', () => ({
  getPageClassName: (...args: [boolean, string, boolean]) => getPageClassNameMock(...args),
}));

vi.mock('features/auth', () => ({
  useAuth: () => ({
    user: null,
    canShowAi: false,
    canShowWebSearch: false,
  }),
  UserPreviewCard: ({ displayName }: { displayName?: string }) => (
    <span>{displayName ?? 'User'}</span>
  ),
}));

vi.mock('app/providers/theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('features/items/hooks/use-item-ai-reviews', () => ({
  useItemAiReviews: () => ({
    reviews: null,
    reviewsLoading: false,
    reviewsError: null,
  }),
}));

import { GuestWishlistPreview } from './guest-wishlist-preview.component';

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

function renderGuestPreview(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <ToastProvider>{ui}</ToastProvider>
    </MemoryRouter>
  );
}

describe('GuestWishlistPreview', () => {
  beforeEach(() => {
    getPageClassNameMock.mockClear();
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === OVERLAY_BREAKPOINT_MEDIA_QUERY,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  test('shows the real list UI without claim, add, or owner chrome', () => {
    renderGuestPreview(<GuestWishlistPreview wishlist={wishlist} items={[item]} />);

    expect(screen.getByRole('heading', { name: 'Birthday Gifts' })).toBeInTheDocument();
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText('Noise cancelling')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
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
    renderGuestPreview(<GuestWishlistPreview wishlist={wishlist} items={[item]} />);

    expect(screen.getByRole('button', { name: /view item/i })).toBeInTheDocument();
  });

  test('wires pageClassName for closed and open View Item drawer', () => {
    renderGuestPreview(<GuestWishlistPreview wishlist={wishlist} items={[item]} />);

    expect(getPageClassNameMock).toHaveBeenCalledWith(false, expect.any(String), false);

    fireEvent.click(screen.getByRole('button', { name: /view item/i }));

    expect(getPageClassNameMock).toHaveBeenCalledWith(true, expect.any(String), false);
  });

  test('refreshes open View Item when items props update', () => {
    function Harness({ items }: { items: Item[] }) {
      return <GuestWishlistPreview wishlist={wishlist} items={items} />;
    }

    const { rerender } = renderGuestPreview(<Harness items={[item]} />);

    fireEvent.click(screen.getByRole('button', { name: /view item/i }));
    expect(screen.getByDisplayValue('Headphones')).toBeInTheDocument();

    const updated = { ...item, Name: 'Noise Cancelling Headphones' };
    rerender(
      <MemoryRouter>
        <ToastProvider>
          <Harness items={[updated]} />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('Noise Cancelling Headphones')).toBeInTheDocument();
  });

  test('shows refresh error banner when provided', () => {
    renderGuestPreview(
      <GuestWishlistPreview
        wishlist={wishlist}
        items={[item]}
        refreshError="This share link is no longer available."
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/no longer available/i);
  });
});
