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
import { Item } from '../../interfaces/item.interface';
import { ADD_ITEM_FORM_ID } from './add-item-form.html';

vi.mock('../../api/items.api', () => ({
  itemsApi: {
    getFieldDefinitions: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
    summarizeDescription: vi.fn(),
    extractMetadata: vi.fn(),
  },
}));

vi.mock('features/wishlists', () => ({
  wishlistsApi: {
    listPriorities: vi.fn().mockResolvedValue([]),
    deletePriority: vi.fn().mockResolvedValue(undefined),
  },
}));

const baseFormProps = {
  listId: 'test-list-id',
  isOwner: true,
  onSuccess: vi.fn(),
  existingCategories: [],
  linkedItemIds: [] as string[],
  resolvedLinkedCount: 0,
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
  isOpen: true,
};

const mockEditItem: Item = {
  Id: 'item-1',
  ListId: 'test-list-id',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Test Headphones',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Priority: null,
  Links: [
    {
      Id: 'link-1',
      ItemId: 'item-1',
      Url: 'https://amazon.com/old-product',
      RetailerName: 'Amazon',
      ExtractedPrice: 99.99,
      ExtractedImageUrl: null,
    },
  ],
  Claims: [],
  IsClaimed: false,
};

describe('AddItemForm - Dynamic Fields & Dependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    vi.mocked(itemsApi.updateItem).mockResolvedValue(mockEditItem);
  });

  test('loads dynamic fields and evaluates dependencies', async () => {
    const mockDefinitions = [
      {
        Id: '1',
        Category: 'clothing',
        FieldKey: 'PantsSize',
        Label: 'Pants Size',
        Placeholder: '32x30',
        DisplayOrder: 1,
        Dependencies: [],
      },
      {
        Id: '2',
        Category: 'clothing',
        FieldKey: 'WaistFit',
        Label: 'Waist Fit',
        Placeholder: 'e.g. Slim',
        DisplayOrder: 2,
        Dependencies: [
          {
            Id: 'dep-1',
            DependentFieldId: '2',
            TriggerFieldKey: 'PantsSize',
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

    const toggleBtn = screen.getByText('Custom Fields');
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

  test('persists link, website name, and price when saving an edit', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        item={mockEditItem}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Paste product URL...')).toHaveValue('https://amazon.com/old-product');
    });

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://target.com/new-product' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amazon, Target'), {
      target: { value: 'Target' },
    });
    fireEvent.change(screen.getByPlaceholderText('0.00'), {
      target: { value: '149.99' },
    });

    fireEvent.submit(document.getElementById(ADD_ITEM_FORM_ID)!);

    await waitFor(() => {
      expect(itemsApi.updateItem).toHaveBeenCalledWith(
        'item-1',
        'Test Headphones',
        null,
        null,
        null,
        null,
        [],
        'https://target.com/new-product',
        149.99,
        'Target'
      );
    });
  });
});

describe('AddItemForm - AI Summarize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    vi.mocked(itemsApi.summarizeDescription).mockResolvedValue('AI generated notes.');
  });

  test('hides summarize controls when AI is unavailable', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={false}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Sony WH-1000XM5'), {
      target: { value: 'Cool Tee' },
    });

    expect(screen.queryByRole('button', { name: /AI Summarize/i })).not.toBeInTheDocument();
  });

  test('hides summarize controls when list AI is disabled', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Sony WH-1000XM5'), {
      target: { value: 'Cool Tee' },
    });

    expect(screen.queryByRole('button', { name: /AI Summarize/i })).not.toBeInTheDocument();
  });

  test('summarizes notes with CustomFields payload and supports one-step undo', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. Sony WH-1000XM5'), {
      target: { value: 'Cool Tee' },
    });
    fireEvent.change(screen.getByPlaceholderText('Add specific details, reasons you want this, or alternative options...'), {
      target: { value: 'Original notes' },
    });

    fireEvent.click(screen.getByText('Custom Fields'));
    fireEvent.click(screen.getByRole('button', { name: /Add Field/i }));

    const fieldNameInput = screen.getByPlaceholderText('Field name');
    fireEvent.change(fieldNameInput, { target: { value: 'Shirt Size' } });
    fireEvent.blur(fieldNameInput);

    const fieldValueInputs = screen.getAllByPlaceholderText('Value');
    fireEvent.change(fieldValueInputs[fieldValueInputs.length - 1], {
      target: { value: 'L' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Summarize$/i }));

    await waitFor(() => {
      expect(itemsApi.summarizeDescription).toHaveBeenCalledWith(
        expect.objectContaining({
          listId: 'test-list-id',
          name: 'Cool Tee',
          text: 'Original notes',
          customFields: expect.objectContaining({
            UserDefined: expect.objectContaining({ 'Shirt Size': 'L' }),
          }),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Add specific details, reasons you want this, or alternative options...')
      ).toHaveValue('AI generated notes.');
    });

    fireEvent.click(screen.getByRole('button', { name: /Undo summarize/i }));

    expect(
      screen.getByPlaceholderText('Add specific details, reasons you want this, or alternative options...')
    ).toHaveValue('Original notes');
    expect(screen.queryByRole('button', { name: /Undo summarize/i })).not.toBeInTheDocument();
  });
});

describe('AddItemForm - Auto populate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    vi.mocked(itemsApi.extractMetadata).mockResolvedValue({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: [],
      ImageUrl: null,
      CustomFields: {
        Predefined: { ShirtSize: 'L', Color: 'Black' },
        UserDefined: { Brand: 'Acme', Material: 'Cotton' },
      },
    });
  });

  test('hides legacy sizing inputs when global AI is enabled', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(itemsApi.extractMetadata).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Custom Fields'));

    expect(screen.queryByPlaceholderText('32x30')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Matte Black')).not.toBeInTheDocument();
  });

  test('applies AI user-defined fields as custom field rows', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
      expect(screen.getByText('Material')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cotton')).toBeInTheDocument();
    });
  });

  test('sends listId when scraping metadata', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
        canUseWebSearchOnList={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(itemsApi.extractMetadata).toHaveBeenCalledWith('https://shop.example/hoodie', {
        listId: 'test-list-id',
      });
    });
  });

  test('shows passive web search indicator when enabled for list', () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canUseWebSearchOnList={true}
      />
    );

    expect(screen.getByLabelText('Web search enabled for this list')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /search the web/i })).not.toBeInTheDocument();
  });

  test('hides category chip picker when global AI is enabled', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    expect(screen.queryByText('Digital & Tech')).not.toBeInTheDocument();
    expect(screen.queryByText('Apparel & Accessories')).not.toBeInTheDocument();
    expect(screen.getByText('+ Add')).toBeInTheDocument();
    expect(
      screen.getByText('Assigned automatically when you auto-fill from a product link.')
    ).toBeInTheDocument();
  });

  test('shows list-used categories when global AI is enabled', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
        existingCategories={['apparel_accessories', 'birthday_gifts']}
      />
    );

    expect(screen.getByText('Apparel & Accessories')).toBeInTheDocument();
    expect(screen.getByText('Birthday Gifts')).toBeInTheDocument();
    expect(screen.queryByText('Digital & Tech')).not.toBeInTheDocument();
  });

  test('shows AI-assigned category as read-only when populated', async () => {
    vi.mocked(itemsApi.extractMetadata).mockResolvedValue({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: ['apparel_accessories', 'health_wellness'],
      ImageUrl: null,
      CustomFields: { Predefined: {}, UserDefined: {} },
    });

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Clothing', pressed: true })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Apparel & Accessories', pressed: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Health & Wellness', pressed: false })).toBeInTheDocument();
    expect(screen.getByText('+ Add')).toBeInTheDocument();
    expect(screen.queryByText('Digital & Tech')).not.toBeInTheDocument();
  });

  test('applies CustomFields predefined and user-defined rows', async () => {
    vi.mocked(itemsApi.extractMetadata).mockResolvedValue({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: [],
      ImageUrl: null,
      CustomFields: {
        Predefined: { Color: 'Black', ShirtSize: 'L' },
        UserDefined: { Brand: 'Acme' },
      },
    });

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
      expect(screen.getByText('Shirt Size')).toBeInTheDocument();
      expect(screen.getByDisplayValue('L')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
    });
  });

  test('maps scraped fields to custom rows when AI is disabled and no definitions', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(itemsApi.extractMetadata).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Custom Fields'));

    await waitFor(() => {
      expect(screen.getByText('Shirt Size')).toBeInTheDocument();
      expect(screen.getByDisplayValue('L')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText('32x30')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Matte Black')).not.toBeInTheDocument();
  });
});
