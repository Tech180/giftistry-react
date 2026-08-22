import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ShareFabPanel } from './share-fab-panel.component';

vi.mock('features/wishlists/api/wishlists.api', () => ({
  wishlistsApi: {
    listShares: vi.fn(async () => []),
  },
}));

vi.mock('../panel/components/tabs/link/link.component', () => ({
  LinkTab: () => <div>Link tab content</div>,
}));

vi.mock('../panel/components/tabs/friends/friends.component', () => ({
  FriendsTab: () => <div>Invite tab content</div>,
}));

vi.mock('../management/management.component', () => ({
  ShareManagement: () => <div>Access tab content</div>,
}));

describe('ShareFabPanel', () => {
  test('defaults to Link tab and switches segmented tabs', () => {
    const onClose = vi.fn();

    render(
      <ShareFabPanel listId="list-1" isOwner onClose={onClose} />
    );

    expect(screen.getByRole('tab', { name: 'Link' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Link tab content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Invite' }));
    expect(screen.getByRole('tab', { name: 'Invite' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Invite tab content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Access' }));
    expect(screen.getByText('Access tab content')).toBeInTheDocument();
  });

  test('calls onClose when header close is clicked', () => {
    const onClose = vi.fn();

    render(
      <ShareFabPanel listId="list-1" isOwner onClose={onClose} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
