import { apiClient, ApiError } from 'core/api/client';
import { ItemLink } from '../interfaces/item-link.interface';
import { Claim } from '../interfaces/item-claim.interface';
import { Item } from '../interfaces/item.interface';
import { FieldDefinition } from '../interfaces/field-definition.interface';
import type { ImportFileFormat } from '../interfaces/import-file-format.interface';
import type { ImportedItemPreview } from '../interfaces/imported-item-preview.interface';
import type { ImportPreviewResult } from '../interfaces/import-preview-result.interface';
import type { BulkAddResult } from '../interfaces/bulk-add-result.interface';

export interface ExtractMetadataCustomFields {
  Predefined: Record<string, string>;
  UserDefined: Record<string, string>;
}

function toStringFieldMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string' && value.trim()) {
      result[key] = value.trim();
    }
  }
  return result;
}

function normalizeExtractCustomFields(raw: unknown): ExtractMetadataCustomFields {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { Predefined: {}, UserDefined: {} };
  }

  const source = raw as Record<string, unknown>;
  const predefined = source.Predefined ?? {};
  const userDefined = source.UserDefined ?? {};

  return {
    Predefined: toStringFieldMap(predefined),
    UserDefined: toStringFieldMap(userDefined),
  };
}

export interface ExtractMetadataResult {
  Title: string;
  Price: number | null;
  Description: string | null;
  Category: string | null;
  CategoryAlternatives: string[];
  ImageUrl: string | null;
  WebsiteName: string | null;
  CustomFields: ExtractMetadataCustomFields;
}

export const itemsApi = {
  listItems: (listId: string) =>
    apiClient.get<Item[]>(`/api/wishlists/${listId}/items`),

  addItem: (
    listId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    isHiddenIdea?: boolean,
    linkUrl?: string | null,
    price?: number | null,
    websiteName?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[]
  ) =>
    apiClient.post<Item>(
      `/api/wishlists/${listId}/items`,
      {
        Name: name,
        Description: description,
        PriorityId: priorityId,
        IsHiddenIdea: isHiddenIdea,
        LinkUrl: linkUrl,
        Price: price,
        WebsiteName: websiteName,
        Category: category,
        Priority: priority,
        SharedWithUserIds: sharedWithUserIds,
      },
      'Items'
    ),

  extractMetadata: async (
    url: string,
    options?: { listId?: string }
  ): Promise<ExtractMetadataResult> => {
    const result = await apiClient.post<{
      Title?: string;
      Price?: number | null;
      Description?: string | null;
      Category?: string | null;
      CategoryAlternatives?: string[] | null;
      ImageUrl?: string | null;
      WebsiteName?: string | null;
      CustomFields?: {
        Predefined?: Record<string, string>;
        UserDefined?: Record<string, string>;
      };
      Diagnostics?: {
        Source?: string;
        Confidence?: number;
        FieldsFound?: string[];
        Blocked?: boolean;
        ValidationReason?: string;
      };
      Message?: string;
    }>(`/api/items/extract-metadata`, {
      Url: url,
      ListId: options?.listId,
    }, 'Items');

    if (result.Message && !result.Title) {
      throw new ApiError(result.Message, 422, 'SCRAPE_FAILED');
    }

    return {
      Title: result.Title ?? '',
      Price: result.Price ?? null,
      Description: result.Description ?? null,
      Category: result.Category ?? null,
      CategoryAlternatives: result.CategoryAlternatives ?? [],
      ImageUrl: result.ImageUrl ?? null,
      WebsiteName: result.WebsiteName ?? null,
      CustomFields: normalizeExtractCustomFields(result.CustomFields),
    };
  },

  addItemLink: (itemId: string, url: string) =>
    apiClient.post<ItemLink>(
      `/api/items/${itemId}/links`,
      { Url: url },
      'Items'
    ),

  syncItemLinks: (itemId: string, targetItemIds: string[]) =>
    apiClient.post<void>(
      `/api/items/${itemId}/links/sync`,
      { TargetItemIds: targetItemIds },
      'Items'
    ),

  claimItem: (
    itemId: string,
    amount?: number | null,
    claimedByName?: string | null,
    anonymous?: boolean,
    quantity?: number,
    selection?: string | null
  ) =>
    apiClient.post<Claim>(
      `/api/items/${itemId}/claims`,
      { Amount: amount, ClaimedByName: claimedByName, Anonymous: anonymous, Quantity: quantity, Selection: selection },
      'Items'
    ),

  unclaimItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}/claims`),

  updateItem: (
    itemId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[],
    linkUrl?: string | null,
    price?: number | null,
    websiteName?: string | null
  ) =>
    apiClient.put<Item>(
      `/api/items/${itemId}`,
      {
        Name: name,
        Description: description,
        PriorityId: priorityId,
        Category: category,
        Priority: priority,
        SharedWithUserIds: sharedWithUserIds,
        LinkUrl: linkUrl,
        Price: price,
        WebsiteName: websiteName,
      },
      'Items'
    ),

  deleteItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}`),

  getItemReviews: (itemId: string) =>
    apiClient.get<{ Summary: string; Pros: string[]; Cons: string[]; Reviews: string[] } | null>(`/api/items/${itemId}/reviews`),

  getFieldDefinitions: (category: string) =>
    apiClient.get<FieldDefinition[]>(`/api/items/field-definitions?category=${category}`),

  summarizeDescription: async (payload: {
    listId: string;
    name: string;
    text?: string;
    linkUrl?: string;
    websiteName?: string;
    price?: number | null;
    category?: string;
    priority?: number | null;
    customFields?: {
      Predefined?: Record<string, string | null>;
      UserDefined?: Record<string, string>;
    };
    variations?: { Name: string; Quantity: number }[];
    desiredQuantity?: number;
  }) => {
    const result = await apiClient.post<{ Description?: string; Message?: string }>(
      '/api/items/summarize-description',
      {
        ListId: payload.listId,
        Name: payload.name,
        Text: payload.text,
        LinkUrl: payload.linkUrl,
        WebsiteName: payload.websiteName,
        Price: payload.price,
        Category: payload.category,
        Priority: payload.priority,
        CustomFields: payload.customFields,
        Variations: payload.variations,
        DesiredQuantity: payload.desiredQuantity,
      },
      'Items'
    );

    if (result.Message && !result.Description) {
      throw new ApiError(result.Message, 422, 'SUMMARIZE_FAILED');
    }

    return result.Description ?? '';
  },

  importPreview: async (input: {
    listId?: string;
    fileName: string;
    format?: ImportFileFormat;
    content: string;
    contentEncoding: 'text' | 'base64' | 'data-url';
  }): Promise<ImportPreviewResult> => {
    const result = await apiClient.post<{
      Items?: ImportedItemPreview[];
      Warnings?: string[];
      SourceFormat?: ImportFileFormat;
      ParseMode?: 'deterministic' | 'ai';
      SuggestedWishlistTitle?: string;
      Message?: string;
      Success?: boolean;
    }>('/api/items/import-preview', {
      ListId: input.listId,
      FileName: input.fileName,
      Format: input.format,
      Content: input.content,
      ContentEncoding: input.contentEncoding,
    }, 'Items');

    if (result.Message && !result.Items) {
      throw new ApiError(result.Message, 422, 'IMPORT_PREVIEW_FAILED');
    }

    return {
      Items: result.Items ?? [],
      Warnings: result.Warnings ?? [],
      SourceFormat: result.SourceFormat ?? input.format ?? 'unknown',
      ParseMode: result.ParseMode ?? 'ai',
      SuggestedWishlistTitle: result.SuggestedWishlistTitle,
    };
  },

  bulkAdd: async (
    listId: string,
    items: Array<{
      name: string;
      description?: string | null;
      linkUrl?: string | null;
      price?: number | null;
      category?: string | null;
      priority?: number | null;
    }>
  ): Promise<BulkAddResult> => {
    const result = await apiClient.post<{
      Created?: number;
      Items?: Item[];
      Failed?: Array<{ Index?: number; Message?: string }>;
    }>(
      `/api/wishlists/${listId}/items/bulk`,
      {
        Items: items.map((item) => ({
          Name: item.name,
          Description: item.description,
          LinkUrl: item.linkUrl,
          Price: item.price,
          Category: item.category,
          Priority: item.priority,
        })),
      },
      'Items'
    );

    return {
      Created: result.Created ?? 0,
      Items: Array.isArray(result.Items) ? result.Items : [],
      Failed: (result.Failed ?? []).map((row) => ({
        Index: row.Index ?? 0,
        Message: row.Message ?? 'Failed to create item',
      })),
    };
  },
};
export type { ItemLink, Claim, Item, FieldDefinition };
