import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock react-router-dom first
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

import { AddItemForm } from './add-item-form.component';
import { itemsApi } from '../../api/items.api';

// Mock the APIs
jest.mock('../../api/items.api', () => ({
  itemsApi: {
    getFieldDefinitions: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
  },
}));

jest.mock('features/wishlists', () => ({
  wishlistsApi: {
    listPriorities: jest.fn().mockResolvedValue([]),
    deletePriority: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('AddItemForm - Dynamic Fields & Dependencies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    (itemsApi.getFieldDefinitions as jest.Mock).mockResolvedValue(mockDefinitions);

    render(
      <AddItemForm
        listId="test-list-id"
        isOwner={true}
        onSuccess={() => {}}
        existingCategories={[]}
      />
    );

    // Click 'Apparel & Accessories' category chip
    const categoryChip = screen.getByText('Apparel & Accessories');
    fireEvent.click(categoryChip);

    // Toggle extra fields drawer
    const toggleBtn = screen.getByText(/Show Custom Fields/);
    fireEvent.click(toggleBtn);

    // Wait for definitions to load and confirm pants size is rendered, waist fit is hidden
    await waitFor(() => {
      expect(screen.getByText('Pants Size')).toBeInTheDocument();
    });
    expect(screen.queryByText('Waist Fit')).not.toBeInTheDocument();

    // Type into Pants Size to satisfy 'any' value dependency
    const pantsInput = screen.getByPlaceholderText('32x30');
    fireEvent.change(pantsInput, { target: { value: '32x30' } });

    // Verify Waist Fit appears dynamically
    await waitFor(() => {
      expect(screen.getByText('Waist Fit')).toBeInTheDocument();
    });
  });
});
