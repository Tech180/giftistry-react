import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: { Id: 'test-user-id' },
  }),
}));

import { AddItemForm } from './add-item-form.component';
import { itemsApi } from '../../api/items.api';
import { jobsApi } from 'features/jobs/api/jobs.api';
import type { BackgroundJobView } from 'features/jobs/interfaces/background-job.interface';
import { Item } from '../../interfaces/item.interface';
import { ADD_ITEM_FORM_ID } from './add-item-form.html';

vi.mock('../../api/items.api', () => ({
  itemsApi: {
    getFieldDefinitions: vi.fn(),
    addItem: vi.fn(),
    updateItem: vi.fn(),
  },
}));

vi.mock('features/jobs/api/jobs.api', () => ({
  jobsApi: {
    startItemEnrich: vi.fn(),
    startItemSummarize: vi.fn(),
    getJob: vi.fn(),
    cancelJob: vi.fn(),
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
  setLinkedItemIds: vi.fn(),
  resolvedLinkedCount: 0,
  relatedItemIds: [] as string[],
  resolvedRelatedCount: 0,
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
  isRelatingModeActive: false,
  setIsRelatingModeActive: vi.fn(),
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

const queuedJob = (kind: string): BackgroundJobView => ({
  Id: 'job-1',
  Kind: kind,
  ListId: 'test-list-id',
  UserId: 'test-user-id',
  Status: 'queued',
  Phase: 'queued',
  ProgressDone: 0,
  ProgressTotal: 1,
  Message: '',
  Error: null,
});

const finishedJob = (kind: string, result: Record<string, unknown>): BackgroundJobView => ({
  ...queuedJob(kind),
  Status: 'completed',
  Phase: 'completed',
  Result: result,
});

function mockEnrichJob(result: Record<string, unknown>) {
  vi.mocked(jobsApi.startItemEnrich).mockResolvedValue({ Job: queuedJob('item-enrich') });
  vi.mocked(jobsApi.getJob).mockResolvedValue(finishedJob('item-enrich', result));
}

function mockSummarizeJob(description: string) {
  vi.mocked(jobsApi.startItemSummarize).mockResolvedValue({ Job: queuedJob('item-summarize') });
  vi.mocked(jobsApi.getJob).mockResolvedValue(finishedJob('item-summarize', { Description: description }));
}

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
        setLinkedItemIds={() => {}}
        resolvedLinkedCount={0}
        relatedItemIds={[]}
        resolvedRelatedCount={0}
        isLinkingModeActive={false}
        setIsLinkingModeActive={() => {}}
        isRelatingModeActive={false}
        setIsRelatingModeActive={() => {}}
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
        'Target',
        null,
        false
      );
    });
  });
});

describe('AddItemForm - AI Summarize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    mockSummarizeJob('AI generated notes.');
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
      expect(jobsApi.startItemSummarize).toHaveBeenCalledWith(
        expect.objectContaining({
          listId: 'test-list-id',
          writeBack: false,
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
    mockEnrichJob({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: null,
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
      expect(jobsApi.startItemEnrich).toHaveBeenCalled();
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

  test('starts a draft-populate enrich job for the pasted link', async () => {
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
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
        intent: 'draft-populate',
        listId: 'test-list-id',
        url: 'https://shop.example/hoodie',
        itemId: undefined,
        writeBack: false,
      });
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cool Hoodie')).toBeInTheDocument();
    });
  });

  test('starts an update-item enrich job and notifies the parent when editing', async () => {
    const onItemEnriched = vi.fn();
    mockEnrichJob({
      ItemId: 'item-1',
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: null,
      CustomFields: {
        Predefined: { ShirtSize: 'L', Color: 'Black' },
        UserDefined: { Brand: 'Acme' },
      },
    });

    render(
      <AddItemForm
        {...baseFormProps}
        item={mockEditItem}
        onItemEnriched={onItemEnriched}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Paste product URL...')).toHaveValue(
        'https://amazon.com/old-product'
      );
    });

    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
        intent: 'update-item',
        listId: 'test-list-id',
        url: 'https://amazon.com/old-product',
        itemId: 'item-1',
        writeBack: true,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
      expect(screen.getByText('Shirt Size')).toBeInTheDocument();
      expect(screen.getByDisplayValue('L')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(onItemEnriched).toHaveBeenCalled();
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
    mockEnrichJob({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: ['apparel_accessories', 'health_wellness'],
      ImageUrl: null,
      WebsiteName: null,
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
    mockEnrichJob({
      Title: 'Cool Hoodie',
      Price: 59.99,
      Description: 'Soft fleece',
      Category: 'clothing',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: null,
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
      expect(jobsApi.startItemEnrich).toHaveBeenCalled();
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

  test('shows warning when AI populate failed but scrape succeeded', async () => {
    mockEnrichJob({
      Title: 'Dyson V11 Torque Drive Cordless Vacuum Cleaner, Blue',
      Price: 599,
      Description: null,
      Category: 'home',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: 'Amazon',
      CustomFields: { Predefined: {}, UserDefined: {} },
      Diagnostics: { AiPopulate: 'failed' },
    });

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/dyson' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Product details were found, but AI summarization has failed/i
        )
      ).toBeInTheDocument();
    });
    expect(
      screen.getByDisplayValue('Dyson V11 Torque Drive Cordless Vacuum Cleaner, Blue')
    ).toBeInTheDocument();
  });

  test('does not show AI warning when populate succeeded', async () => {
    mockEnrichJob({
      Title: 'Dyson V11 Cordless Vacuum Cleaner',
      Price: 599,
      Description: null,
      Category: 'home',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: null,
      CustomFields: { Predefined: {}, UserDefined: {} },
      Diagnostics: { AiPopulate: 'succeeded' },
    });

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/dyson' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Dyson V11 Cordless Vacuum Cleaner')
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/AI summarization has failed/i)
    ).not.toBeInTheDocument();
  });

  test('shows hard extract error instead of AI warning when the enrich job fails', async () => {
    vi.mocked(jobsApi.startItemEnrich).mockRejectedValue(new Error('network'));

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/dyson' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('network');
      expect(screen.getByRole('alert')).toHaveTextContent('You can still enter them manually.');
    });
    expect(
      screen.queryByText(/AI summarization has failed/i)
    ).not.toBeInTheDocument();
  });

  test('shows the enrich job Error when auto-fill fails', async () => {
    vi.mocked(jobsApi.startItemEnrich).mockResolvedValue({ Job: queuedJob('item-enrich') });
    vi.mocked(jobsApi.getJob).mockResolvedValue({
      ...queuedJob('item-enrich'),
      Status: 'failed',
      Error:
        'Playwright’s bundled Chromium cannot run on NixOS (dynamic linker stub).\nOriginal error: stub-ld',
    });

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/dyson' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/cannot run on NixOS/i);
      expect(screen.getByRole('alert')).toHaveTextContent('You can still enter them manually.');
    });
    expect(screen.queryByText(/Original error/i)).not.toBeInTheDocument();
  });

  test('clears AI warning when sidebar closes', async () => {
    mockEnrichJob({
      Title: 'Messy Title',
      Price: 10,
      Description: null,
      Category: 'home',
      CategoryAlternatives: [],
      ImageUrl: null,
      WebsiteName: null,
      CustomFields: { Predefined: {}, UserDefined: {} },
      Diagnostics: { AiPopulate: 'failed' },
    });

    const { rerender } = render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
        isOpen={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/item' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(
        screen.getByText(/AI summarization has failed/i)
      ).toBeInTheDocument();
    });

    rerender(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
        isOpen={false}
      />
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/AI summarization has failed/i)
      ).not.toBeInTheDocument();
    });
  });

  test('clears AI warning when rescanning succeeds', async () => {
    vi.mocked(jobsApi.startItemEnrich).mockResolvedValue({ Job: queuedJob('item-enrich') });
    vi.mocked(jobsApi.getJob)
      .mockResolvedValueOnce(
        finishedJob('item-enrich', {
          Title: 'Messy Title',
          Price: 10,
          Description: null,
          Category: 'home',
          CategoryAlternatives: [],
          ImageUrl: null,
          WebsiteName: null,
          CustomFields: { Predefined: {}, UserDefined: {} },
          Diagnostics: { AiPopulate: 'failed' },
        })
      )
      .mockResolvedValueOnce(
        finishedJob('item-enrich', {
          Title: 'Clean Title',
          Price: 10,
          Description: null,
          Category: 'home',
          CategoryAlternatives: [],
          ImageUrl: null,
          WebsiteName: null,
          CustomFields: { Predefined: {}, UserDefined: {} },
          Diagnostics: { AiPopulate: 'succeeded' },
        })
      );

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/item' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(
        screen.getByText(/AI summarization has failed/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Clean Title')).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/AI summarization has failed/i)
    ).not.toBeInTheDocument();
  });
});

describe('AddItemForm - Metadata hydration on edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    vi.mocked(itemsApi.updateItem).mockResolvedValue(mockEditItem);
  });

  test('keeps the custom field name input focused while typing more than one character', () => {
    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.click(screen.getByText('Custom Fields'));
    fireEvent.click(screen.getByRole('button', { name: /Add Field/i }));

    const nameInput = screen.getByPlaceholderText('Field name');
    fireEvent.change(nameInput, { target: { value: 'B' } });
    expect(screen.getByPlaceholderText('Field name')).toHaveValue('B');
    fireEvent.change(screen.getByPlaceholderText('Field name'), { target: { value: 'Br' } });
    fireEvent.change(screen.getByPlaceholderText('Field name'), { target: { value: 'Bra' } });
    fireEvent.change(screen.getByPlaceholderText('Field name'), { target: { value: 'Brand' } });
    expect(screen.getByPlaceholderText('Field name')).toHaveValue('Brand');
  });

  test('saves user-defined custom fields on create', async () => {
    vi.mocked(itemsApi.addItem).mockResolvedValue({
      ...mockEditItem,
      Id: 'new-1',
      Name: 'Cool Tee',
      Links: [],
    });

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
    fireEvent.click(screen.getByText('Custom Fields'));
    fireEvent.click(screen.getByRole('button', { name: /Add Field/i }));
    const fieldNameInput = screen.getByPlaceholderText('Field name');
    fireEvent.change(fieldNameInput, { target: { value: 'Brand' } });
    fireEvent.blur(fieldNameInput);
    const valueInputs = screen.getAllByPlaceholderText('Value');
    fireEvent.change(valueInputs[valueInputs.length - 1], {
      target: { value: 'Nike' },
    });

    fireEvent.submit(document.getElementById(ADD_ITEM_FORM_ID)!);

    await waitFor(() => {
      expect(itemsApi.addItem).toHaveBeenCalledWith(
        'test-list-id',
        'Cool Tee',
        null,
        null,
        false,
        null,
        null,
        null,
        null,
        null,
        [],
        expect.objectContaining({
          CustomFields: expect.objectContaining({
            UserDefined: expect.objectContaining({ Brand: 'Nike' }),
          }),
        })
      );
    });
  });

  test('loads custom fields from item.Metadata when Description is plain text', async () => {
    const itemWithMetadata: Item = {
      ...mockEditItem,
      Name: 'mosanana Oval Cat Eye Sunglasses',
      Description: 'Gift notes about the sunglasses',
      Metadata: {
        Text: null,
        CustomFields: {
          Predefined: { Color: 'Black', ModelNumber: 'MS52372' },
          UserDefined: { Brand: 'mosanana' },
        },
      },
    };

    render(
      <AddItemForm
        {...baseFormProps}
        item={itemWithMetadata}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Gift notes about the sunglasses')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Black')).toBeInTheDocument();
      expect(screen.getByText('Model Number')).toBeInTheDocument();
      expect(screen.getByDisplayValue('MS52372')).toBeInTheDocument();
      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByDisplayValue('mosanana')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Gift notes about the sunglasses'), {
      target: { value: 'Gift notes about the sunglasses (updated)' },
    });

    fireEvent.submit(document.getElementById(ADD_ITEM_FORM_ID)!);

    await waitFor(() => {
      expect(itemsApi.updateItem).toHaveBeenCalledWith(
        'item-1',
        'mosanana Oval Cat Eye Sunglasses',
        null,
        null,
        null,
        null,
        [],
        'https://amazon.com/old-product',
        99.99,
        'Amazon',
        expect.objectContaining({
          Text: 'Gift notes about the sunglasses (updated)',
          CustomFields: expect.objectContaining({
            Predefined: expect.objectContaining({
              Color: 'Black',
              modelNumber: 'MS52372',
            }),
            UserDefined: expect.objectContaining({
              Brand: 'mosanana',
            }),
          }),
        }),
        false
      );
    });
  });
});

describe('AddItemForm - mutual AI button disable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
  });

  test('does not replace website name until the enrich job finishes', async () => {
    let releaseEnrich: () => void = () => {};
    vi.mocked(jobsApi.getJob).mockResolvedValue(
      finishedJob('item-enrich', {
        Title: 'Cool Product',
        Price: 10,
        Description: null,
        Category: null,
        CategoryAlternatives: [],
        ImageUrl: null,
        WebsiteName: 'Amazon',
        CustomFields: { Predefined: {}, UserDefined: {} },
      })
    );
    vi.mocked(jobsApi.startItemEnrich).mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseEnrich = () => resolve({ Job: queuedJob('item-enrich') });
        })
    );

    render(
      <AddItemForm
        {...baseFormProps}
        canShowAi={true}
        listAiEnabled={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://www.amazon.com/dp/123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Amazon, Target'), {
      target: { value: 'My Custom Shop' },
    });

    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByTitle('Auto-fill details from link')).toBeDisabled();
    });
    expect(screen.getByPlaceholderText('Amazon, Target')).toHaveValue('My Custom Shop');

    releaseEnrich();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Amazon, Target')).toHaveValue('Amazon');
    });
  });

  test('disables summarize while populate is running', async () => {
    let releaseEnrich: () => void = () => {};
    vi.mocked(jobsApi.getJob).mockResolvedValue(
      finishedJob('item-enrich', {
        Title: 'Cool Hoodie',
        Price: 59.99,
        Description: 'Soft fleece',
        Category: 'clothing',
        CategoryAlternatives: [],
        ImageUrl: null,
        WebsiteName: null,
        CustomFields: { Predefined: {}, UserDefined: {} },
      })
    );
    vi.mocked(jobsApi.startItemEnrich).mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseEnrich = () => resolve({ Job: queuedJob('item-enrich') });
        })
    );

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
    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });

    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(screen.getByTitle('Auto-fill details from link')).toBeDisabled();
      expect(screen.getByRole('button', { name: /^Summarize$/i })).toBeDisabled();
    });

    releaseEnrich();

    await waitFor(() => {
      expect(screen.getByTitle('Auto-fill details from link')).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /^Summarize$/i })).not.toBeDisabled();
    });
  });

  test('disables magic-link while summarize is running', async () => {
    let releaseSummarize: () => void = () => {};
    vi.mocked(jobsApi.getJob).mockResolvedValue(
      finishedJob('item-summarize', { Description: 'AI generated notes.' })
    );
    vi.mocked(jobsApi.startItemSummarize).mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseSummarize = () => resolve({ Job: queuedJob('item-summarize') });
        })
    );

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
    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Summarize$/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Summarize$/i })).toBeDisabled();
      expect(screen.getByTitle('Auto-fill details from link')).toBeDisabled();
    });

    releaseSummarize();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Summarize$/i })).not.toBeDisabled();
      expect(screen.getByTitle('Auto-fill details from link')).not.toBeDisabled();
    });
  });
});

describe('AddItemForm - abandon pending job on close', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
    vi.mocked(jobsApi.cancelJob).mockResolvedValue(queuedJob('item-enrich'));
    vi.mocked(jobsApi.startItemEnrich).mockResolvedValue({ Job: queuedJob('item-enrich') });
  });

  test('background close promotes draft-populate to create-from-url', async () => {
    const onAutoEnrichStarted = vi.fn();
    let releaseGetJob: (job: BackgroundJobView) => void = () => {};
    vi.mocked(jobsApi.getJob).mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseGetJob = resolve;
        })
    );

    const { rerender } = render(
      <AddItemForm
        {...baseFormProps}
        isOpen={true}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={true}
        onAutoEnrichStarted={onAutoEnrichStarted}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'draft-populate' })
      );
    });

    rerender(
      <AddItemForm
        {...baseFormProps}
        isOpen={false}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={true}
        onAutoEnrichStarted={onAutoEnrichStarted}
      />
    );

    await waitFor(() => {
      expect(jobsApi.cancelJob).toHaveBeenCalledWith('job-1');
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
        intent: 'create-from-url',
        listId: 'test-list-id',
        url: 'https://shop.example/hoodie',
        writeBack: true,
      });
      expect(onAutoEnrichStarted).toHaveBeenCalled();
    });

    releaseGetJob(finishedJob('item-enrich', { Title: 'ignored' }));
  });

  test('background close promotes under StrictMode', async () => {
    const onAutoEnrichStarted = vi.fn();
    let releaseGetJob: (job: BackgroundJobView) => void = () => {};
    vi.mocked(jobsApi.getJob).mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseGetJob = resolve;
        })
    );

    const formProps = {
      ...baseFormProps,
      canShowAi: true,
      listAiEnabled: true,
      listManualJobBackground: true,
      onAutoEnrichStarted,
    };

    const { rerender } = render(
      <React.StrictMode>
        <AddItemForm {...formProps} isOpen={true} />
      </React.StrictMode>
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'draft-populate' })
      );
    });

    rerender(
      <React.StrictMode>
        <AddItemForm {...formProps} isOpen={false} />
      </React.StrictMode>
    );

    await waitFor(() => {
      expect(jobsApi.cancelJob).toHaveBeenCalledWith('job-1');
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
        intent: 'create-from-url',
        listId: 'test-list-id',
        url: 'https://shop.example/hoodie',
        writeBack: true,
      });
      expect(onAutoEnrichStarted).toHaveBeenCalled();
    });

    releaseGetJob(finishedJob('item-enrich', { Title: 'ignored' }));
  });

  test('foreground close cancels the pending job without promoting', async () => {
    vi.mocked(jobsApi.getJob).mockImplementation(() => new Promise(() => {}));

    const { rerender } = render(
      <AddItemForm
        {...baseFormProps}
        isOpen={true}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalled();
    });

    rerender(
      <AddItemForm
        {...baseFormProps}
        isOpen={false}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={false}
      />
    );

    await waitFor(() => {
      expect(jobsApi.cancelJob).toHaveBeenCalledWith('job-1');
    });
    expect(jobsApi.startItemEnrich).toHaveBeenCalledTimes(1);
  });

  test('background close leaves update-item running', async () => {
    vi.mocked(jobsApi.getJob).mockImplementation(() => new Promise(() => {}));

    const { rerender } = render(
      <AddItemForm
        {...baseFormProps}
        item={mockEditItem}
        isOpen={true}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={true}
      />
    );

    fireEvent.click(screen.getByTitle('Auto-fill details from link'));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'update-item' })
      );
    });

    rerender(
      <AddItemForm
        {...baseFormProps}
        item={mockEditItem}
        isOpen={false}
        canShowAi={true}
        listAiEnabled={true}
        listManualJobBackground={true}
      />
    );

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(jobsApi.cancelJob).not.toHaveBeenCalled();
    expect(jobsApi.startItemEnrich).toHaveBeenCalledTimes(1);
  });
});

describe('AddItemForm - suggestion visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
  });

  test('non-owner form shows Visible to list owner, default off', () => {
    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
      />
    );

    const toggle = screen.getByLabelText('Visible to list owner');
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
    expect(screen.queryByText('Suggest as Surprise')).not.toBeInTheDocument();
  });

  test('edit loads Visible to list owner checked when IsHiddenIdea is false', async () => {
    const suggestionItem: Item = {
      ...mockEditItem,
      IsHiddenIdea: false,
      IsSuggestion: true,
      SuggestedByUserId: 'test-user-id',
    };
    vi.mocked(itemsApi.updateItem).mockResolvedValue(suggestionItem);

    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        item={suggestionItem}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Headphones')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Visible to list owner')).toBeChecked();
  });

  test('toggling Visible to list owner alone marks the edit form dirty', async () => {
    const suggestionItem: Item = {
      ...mockEditItem,
      IsHiddenIdea: true,
      IsSuggestion: true,
      SuggestedByUserId: 'test-user-id',
    };
    const onDirtyChange = vi.fn();
    vi.mocked(itemsApi.updateItem).mockResolvedValue(suggestionItem);

    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        item={suggestionItem}
        onDirtyChange={onDirtyChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Headphones')).toBeInTheDocument();
    });

    const toggle = screen.getByLabelText('Visible to list owner');
    expect(toggle).not.toBeChecked();

    onDirtyChange.mockClear();
    fireEvent.click(toggle);

    await waitFor(() => {
      expect(onDirtyChange).toHaveBeenCalledWith(true);
    });
  });

  test('edit submit sends IsHiddenIdea false when Visible to list owner is on', async () => {
    const suggestionItem: Item = {
      ...mockEditItem,
      IsHiddenIdea: true,
      IsSuggestion: true,
      SuggestedByUserId: 'test-user-id',
    };
    vi.mocked(itemsApi.updateItem).mockResolvedValue({
      ...suggestionItem,
      IsHiddenIdea: false,
    });

    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        item={suggestionItem}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Headphones')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Visible to list owner'));
    fireEvent.submit(document.getElementById(ADD_ITEM_FORM_ID)!);

    await waitFor(() => {
      expect(itemsApi.updateItem).toHaveBeenCalled();
      const args = vi.mocked(itemsApi.updateItem).mock.calls[0]!;
      expect(args[0]).toBe('item-1');
      expect(args[11]).toBe(false);
    });
  });
});

describe('AddItemForm readOnly view mode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(itemsApi.getFieldDefinitions).mockResolvedValue([]);
  });

  test('keeps copy link enabled and hides scrape controls', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        item={mockEditItem}
        readOnly
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('https://amazon.com/old-product')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('button', { name: /copy link to clipboard/i })
    ).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: /auto-fill details from link/i })
    ).not.toBeInTheDocument();
  });
});

describe('AddItemForm - linked items multi-count restriction', () => {
  const peerItem: Item = {
    ...mockEditItem,
    Id: 'peer-1',
    Name: 'Peer Gift',
    Links: [],
  };

  test('hides Linked Items when quantity is greater than 1', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        wishlistItems={[mockEditItem, peerItem]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Linked Items')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));

    await waitFor(() => {
      expect(screen.queryByText('Linked Items')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Related Items')).toBeInTheDocument();
  });

  test('shows error and clears links when raising quantity above 1 with links selected', async () => {
    const setLinkedItemIds = vi.fn();
    const setIsLinkingModeActive = vi.fn();
    render(
      <AddItemForm
        {...baseFormProps}
        wishlistItems={[mockEditItem, peerItem]}
        linkedItemIds={['peer-1']}
        resolvedLinkedCount={1}
        setLinkedItemIds={setLinkedItemIds}
        setIsLinkingModeActive={setIsLinkingModeActive}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Linked Items')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /quantity greater than 1 are not currently supported with the linked items feature/i
      );
    });
    expect(setLinkedItemIds).toHaveBeenCalledWith([]);
    expect(setIsLinkingModeActive).toHaveBeenCalledWith(false);
  });

  test('hides Linked Items for non-owner create (suggestion)', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        wishlistItems={[mockEditItem, peerItem]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Related Items')).toBeInTheDocument();
    });
    expect(screen.queryByText('Linked Items')).not.toBeInTheDocument();
  });

  test('hides Linked Items when editing a suggestion', async () => {
    const suggestionItem: Item = {
      ...mockEditItem,
      IsSuggestion: true,
      SuggestedByUserId: 'test-user-id',
    };

    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        item={suggestionItem}
        wishlistItems={[suggestionItem, peerItem]}
      />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Headphones')).toBeInTheDocument();
    });
    expect(screen.queryByText('Linked Items')).not.toBeInTheDocument();
    expect(screen.getByText('Related Items')).toBeInTheDocument();
  });

  test('rejects submit when a suggestion has linked items selected', async () => {
    render(
      <AddItemForm
        {...baseFormProps}
        isOwner={false}
        wishlistItems={[mockEditItem, peerItem]}
        linkedItemIds={['peer-1']}
        resolvedLinkedCount={1}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('e.g. Sony WH-1000XM5')
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('e.g. Sony WH-1000XM5'), {
      target: { value: 'Suggested Gift' },
    });
    fireEvent.submit(document.getElementById(ADD_ITEM_FORM_ID)!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /suggestions cannot use linked items/i
      );
    });
    expect(itemsApi.addItem).not.toHaveBeenCalled();
  });
});
