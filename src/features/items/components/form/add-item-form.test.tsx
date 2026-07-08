import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'test-user-id' } }),
}));

import { AddItemForm } from './add-item-form.component';
import { itemsApi } from '../../api/items.api';

vi.mock('../../api/items.api', () => ({
  itemsApi: {
    getFieldDefinitions: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
  },
}));

vi.mock('features/wishlists', () => ({
  wishlistsApi: {
    listPriorities: vi.fn().mockResolvedValue([]),
    deletePriority: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('AddItemForm - Dynamic Fields & Dependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads dynamic fields and evaluates dependencies', async () => {
    const mockDefinitions = [
      {
        Id: '1',
        Category: 'clothing',
        FieldKey: 'pantsSize',
        Label: 'Pants Size',
        Placeholder: '32x30',
        DisplayOrder: 1,
        Dependencies: [],
      },
      {
        Id: '2',
        Category: 'clothing',
        FieldKey: 'waistFit',
        Label: 'Waist Fit',
        Placeholder: 'e.g. Slim',
        DisplayOrder: 2,
        Dependencies: [
          {
            Id: 'dep-1',
            DependentFieldId: '2',
            TriggerFieldKey: 'pantsSize',
            TriggerValue: 'any',
          },
        ],
      },
    ];

    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue(mockDefinitions);

    render(
      <AddItemForm
        listId="test-list-id"
        isOwner={true}
        onSuccess={() => {}}
        existingCategories={[]}
        linkedItemIds={[]}
        resolvedLinkedCount={0}
        isLinkingModeActive={false}
        setIsLinkingModeActive={() => {}}
      />
    );

    const categoryChip = screen.getByText('Apparel & Accessories');
    fireEvent.click(categoryChip);

    const toggleBtn = screen.getByText(/Custom Fields \(Sizes, Colors\)/);
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText(/Apparel & Accessories.*Sizing \/ Options/i)).toBeInTheDocument();
      expect(screen.getByText('Pants Size')).toBeInTheDocument();
    });
    expect(screen.queryByText('Waist Fit')).not.toBeInTheDocument();

    const pantsInput = screen.getByPlaceholderText('32x30');
    fireEvent.change(pantsInput, { target: { value: '32x30' } });

    await waitFor(() => {
      expect(screen.getByText('Waist Fit')).toBeInTheDocument();
    });
  });
});
