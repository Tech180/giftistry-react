import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

vi.mock('features/items', () => ({
  ADD_ITEM_FORM_ID: 'add-item-form',
  AddItemForm: ({
    isOpen,
    isLinkingModeActive,
    setIsLinkingModeActive,
  }: {
    isOpen: boolean;
    isLinkingModeActive: boolean;
    setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  }) => (
    <div data-testid="add-item-form" data-form-open={String(isOpen)}>
      <button
        type="button"
        title="Select Items from Wishlist"
        onClick={() => setIsLinkingModeActive(true)}
      >
        Link
      </button>
      <span data-testid="linking-active">{String(isLinkingModeActive)}</span>
    </div>
  ),
}));

vi.mock('shared/ui', async () => {
  const actual = await vi.importActual<typeof import('shared/ui')>('shared/ui');
  return {
    ...actual,
    Drawer: ({
      headerExtra,
      title,
      children,
      isOpen,
    }: {
      headerExtra?: React.ReactNode;
      title: string;
      children: React.ReactNode;
      isOpen: boolean;
    }) => (
      <div data-testid="drawer" data-drawer-open={String(isOpen)}>
        <h1>{title}</h1>
        <div data-testid="header-extra">{headerExtra}</div>
        {children}
      </div>
    ),
    MiniDrawer: () => null,
  };
});

import { AddItemTemplate } from './add-item.html';

const baseProps = {
  isOpen: true,
  editingItem: null,
  items: [],
  linkableItems: [],
  resolvedLinkedItems: [],
  resolvedRelatedItems: [],
  linkedItemIds: [] as string[],
  setLinkedItemIds: vi.fn(),
  relatedItemIds: [] as string[],
  setRelatedItemIds: vi.fn(),
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
  isRelatingModeActive: false,
  setIsRelatingModeActive: vi.fn(),
  collapseDrawerWhileLinking: false,
  handleLinkingAudienceChange: vi.fn(),
  isOwner: true,
  listId: 'list-1',
  listAiEnabled: true,
  canShowAi: true,
  listShares: [],
  onClose: vi.fn(),
  onSuccess: vi.fn(),
  setEditingItemDraft: vi.fn(),
  loadData: vi.fn(),
};

describe('AddItemTemplate AI badge', () => {
  test('shows compact AI enabled badge when list AI is on and user can use AI', () => {
    render(<AddItemTemplate {...baseProps} listAiEnabled={true} canShowAi={true} />);

    expect(screen.getByLabelText('AI reviews enabled for this list')).toBeInTheDocument();
    expect(screen.queryByText('AI Enabled')).not.toBeInTheDocument();
  });

  test('shows compact AI disabled badge when list AI is off and user can use AI', () => {
    render(<AddItemTemplate {...baseProps} listAiEnabled={false} canShowAi={true} />);

    expect(screen.getByLabelText('AI reviews disabled for this list')).toBeInTheDocument();
    expect(screen.queryByText('AI Disabled')).not.toBeInTheDocument();
  });

  test('hides AI badge when user cannot use AI features', () => {
    render(<AddItemTemplate {...baseProps} listAiEnabled={true} canShowAi={false} />);

    expect(screen.queryByLabelText('AI reviews enabled for this list')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('AI reviews disabled for this list')).not.toBeInTheDocument();
  });
});

describe('AddItemTemplate link-select drawer visibility', () => {
  test('keeps the drawer open while linking when sidebar does not overlay', () => {
    render(
      <AddItemTemplate
        {...baseProps}
        isLinkingModeActive={true}
        collapseDrawerWhileLinking={false}
      />
    );

    expect(screen.getByTestId('drawer')).toHaveAttribute('data-drawer-open', 'true');
    expect(screen.getByTestId('add-item-form')).toHaveAttribute('data-form-open', 'true');
  });

  test('hides the drawer while linking when sidebar overlays the list, keeping form session open', () => {
    render(
      <AddItemTemplate
        {...baseProps}
        isLinkingModeActive={true}
        collapseDrawerWhileLinking={true}
      />
    );

    expect(screen.getByTestId('drawer')).toHaveAttribute('data-drawer-open', 'false');
    expect(screen.getByTestId('add-item-form')).toHaveAttribute('data-form-open', 'true');
  });

  test('shows the drawer when the form session is open and linking is inactive', () => {
    render(<AddItemTemplate {...baseProps} isLinkingModeActive={false} />);

    expect(screen.getByTestId('drawer')).toHaveAttribute('data-drawer-open', 'true');
    expect(screen.getByTestId('add-item-form')).toHaveAttribute('data-form-open', 'true');
  });

  test('link control activates linking mode', () => {
    const setIsLinkingModeActive = vi.fn();
    render(
      <AddItemTemplate {...baseProps} setIsLinkingModeActive={setIsLinkingModeActive} />
    );

    fireEvent.click(screen.getByTitle('Select Items from Wishlist'));
    expect(setIsLinkingModeActive).toHaveBeenCalledWith(true);
  });
});
