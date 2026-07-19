import { apiClient } from 'core/api/client';
import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type { ImportPreviewResult } from '../interfaces/import-preview-result.interface';
import type { ImportFileFormat } from 'features/items/interfaces/import-file-format.interface';
import type { ImportContentEncoding } from 'features/items/utils/read-import-file.util';
import { normalizeJobsPayload } from '../utils/normalize-jobs-payload.util';

export const jobsApi = {
  previewWishlistImport: (payload: {
    listId?: string | null;
    fileName: string;
    format?: ImportFileFormat | null;
    content: string;
    contentEncoding: ImportContentEncoding;
    allowAi: boolean;
  }) =>
    apiClient.post<ImportPreviewResult>(
      '/api/jobs/wishlist-import/preview',
      {
        ListId: payload.listId,
        FileName: payload.fileName,
        Format: payload.format,
        Content: payload.content,
        ContentEncoding: payload.contentEncoding,
        AllowAi: payload.allowAi,
      },
      'Jobs'
    ),

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
      },
      'Jobs'
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
