import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('features/items', () => ({
  ADD_ITEM_FORM_ID: 'add-item-form',
  AddItemForm: () => <div data-testid="add-item-form">Form</div>,
}));

vi.mock('shared/ui', async () => {
  const actual = await vi.importActual<typeof import('shared/ui')>('shared/ui');
  return {
    ...actual,
    Drawer: ({ headerExtra, title, children }: { headerExtra?: React.ReactNode; title: string; children: React.ReactNode }) => (
      <div data-testid="drawer">
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
  linkedItemIds: [] as string[],
  setLinkedItemIds: vi.fn(),
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
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
