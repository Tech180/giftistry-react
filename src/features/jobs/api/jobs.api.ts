import { apiClient } from 'core/api/client';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportFileFormat } from 'features/items/interfaces/import-file-format.interface';
import type { ImportContentEncoding } from 'features/items/utils/read-import-file.util';
import type { ItemEnrichPayload } from '../interfaces/item-enrich-payload.interface';
import type { ItemEnrichJobResult } from '../interfaces/item-enrich-job-result.interface';
import type { ItemSummarizePayload } from '../interfaces/item-summarize-payload.interface';
import type { ItemSummarizeJobResult } from '../interfaces/item-summarize-job-result.interface';
import { normalizeJobsPayload } from '../utils/normalize-jobs-payload.util';
import { unwrapJobEnvelope } from '../utils/unwrap-job-envelope.util';

export const jobsApi = {
  startWishlistImport: (payload: {
    mode: 'create-list' | 'existing-list';
    listId?: string | null;
    title?: string | null;
    fileName: string;
    format?: ImportFileFormat | null;
    content: string;
    contentEncoding: ImportContentEncoding;
    grabInfo: boolean;
    allowAi: boolean;
    optimizeCategories?: boolean;
  }) =>
    apiClient.post<BackgroundJobView>(
      '/api/jobs/wishlist-import',
      {
        Mode: payload.mode,
        ListId: payload.listId,
        Title: payload.title,
        FileName: payload.fileName,
        Format: payload.format,
        Content: payload.content,
        ContentEncoding: payload.contentEncoding,
        GrabInfo: payload.grabInfo,
        AllowAi: payload.allowAi,
        OptimizeCategories: payload.optimizeCategories,
      },
      'Jobs'
    ),

  startItemEnrich: async (payload: ItemEnrichPayload): Promise<ItemEnrichJobResult> =>
    unwrapJobEnvelope<ItemEnrichJobResult>(
      await apiClient.post<unknown>(
        '/api/jobs/item-enrich',
        {
          Intent: payload.intent,
          ListId: payload.listId,
          Url: payload.url,
          ItemId: payload.itemId,
          WriteBack: payload.writeBack,
        },
        'Jobs'
      )
    ),

  startItemSummarize: async (payload: ItemSummarizePayload): Promise<ItemSummarizeJobResult> =>
    unwrapJobEnvelope<ItemSummarizeJobResult>(
      await apiClient.post<unknown>(
        '/api/jobs/item-summarize',
        {
          ListId: payload.listId,
          ItemId: payload.itemId,
          WriteBack: payload.writeBack,
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
        'Jobs'
      )
    ),

  getJob: (jobId: string) => apiClient.get<BackgroundJobView>(`/api/jobs/${jobId}`),

  getActiveForList: (listId: string) =>
    apiClient.get<BackgroundJobView | null>(`/api/wishlists/${listId}/jobs/active`),

  listMine: async () => normalizeJobsPayload(await apiClient.get<unknown>('/api/jobs/mine')),

  listAdmin: async () => normalizeJobsPayload(await apiClient.get<unknown>('/api/admin/jobs')),

  cancelJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/jobs/${jobId}/cancel`, {}, 'Jobs'),

  suspendJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/jobs/${jobId}/suspend`, {}, 'Jobs'),

  resumeJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/jobs/${jobId}/resume`, {}, 'Jobs'),

  adminCancelJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/admin/jobs/${jobId}/cancel`, {}, 'Jobs'),

  adminSuspendJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/admin/jobs/${jobId}/suspend`, {}, 'Jobs'),

  adminResumeJob: (jobId: string) =>
    apiClient.post<BackgroundJobView>(`/api/admin/jobs/${jobId}/resume`, {}, 'Jobs'),
};
