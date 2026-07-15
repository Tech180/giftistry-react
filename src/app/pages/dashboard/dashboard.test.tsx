import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DashboardTemplate } from './dashboard.html';

vi.mock('features/wishlists', () => ({
  WishlistCard: () => null,
  CreateListForm: () => null,
}));

vi.mock('features/items', () => ({
  ImportStrip: () => <div data-testid="import-strip" />,
}));

describe('DashboardTemplate import control', () => {
  test('renders icon-only Import wishlist Badge without Import Wishlist text', () => {
    const setIsImportOpen = vi.fn();

    render(
      <DashboardTemplate
        getGreeting={() => 'Hello'}
        isCreateOpen={false}
        setIsCreateOpen={vi.fn()}
        isImportOpen={false}
        setIsImportOpen={setIsImportOpen}
        activeTab="my-lists"
        setActiveTab={vi.fn()}
        searchQuery=""
        setSearchQuery={vi.fn()}
        tabs={[{ id: 'my-lists', label: 'My Wishlists', count: 0 }]}
        currentLists={[]}
        isLoading={false}
        error={null}
        handleCreateSuccess={vi.fn()}
        handleImportStarted={vi.fn()}
        emptyIcon={<span />}
        emptyTitle="Empty"
        emptyDesc="Nothing here"
        gridRef={vi.fn()}
        columns={1}
      />
    );

    const importControl = screen.getByRole('button', { name: /import wishlist/i });
    expect(importControl).toBeInTheDocument();
    expect(screen.queryByText('Import Wishlist')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new wishlist/i })).toBeInTheDocument();

    fireEvent.click(importControl);
    expect(setIsImportOpen).toHaveBeenCalledWith(true);
  });
});
