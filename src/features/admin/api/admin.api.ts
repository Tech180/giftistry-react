import { apiClient } from 'core/api/client';
import { AdminUser, AdminUserListResponse, AdminOverviewStats } from '../interfaces/admin-user.interface';
import { AuditLogEntry } from '../interfaces/audit-log-entry.interface';
import { ContentReport } from '../interfaces/content-report.interface';
import { GiftistryUserPolicy } from '../interfaces/giftistry-user-policy.interface';
import { ModerationComment } from '../interfaces/moderation-comment.interface';
import { SitePolicy } from '../interfaces/site-policy.interface';

export const adminApi = {
  getOverview: () =>
    apiClient.get<{ success: boolean; Stats: AdminOverviewStats; RecentAudit: AuditLogEntry[] }>('/api/admin/overview'),

  listUsers: (params: { search?: string; disabled?: string; locked?: string; admin?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.disabled) q.set('disabled', params.disabled);
    if (params.locked) q.set('locked', params.locked);
    if (params.admin) q.set('admin', params.admin);
    if (params.page) q.set('page', String(params.page));
    const qs = q.toString();
    return apiClient.get<AdminUserListResponse>(`/api/admin/users${qs ? `?${qs}` : ''}`);
  },

  getUser: (id: string) =>
    apiClient.get<{ success: boolean; User: AdminUser; Activity: AuditLogEntry[] }>(`/api/admin/users/${id}`),

  createUser: (payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
    emailVerified?: boolean;
    forcePasswordChange?: boolean;
    policy?: Partial<GiftistryUserPolicy>;
  }) => apiClient.post<{ success: boolean; UserId: string }>('/api/admin/users', payload, 'AdminUser'),

  updateUser: (id: string, updates: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string | null;
    emailVerified?: boolean;
  }) =>
    apiClient.patch<{ success: boolean }>(`/api/admin/users/${id}`, updates, 'User'),

  updateUserPolicy: (id: string, policy: {
    isAdmin?: boolean;
    isDisabled?: boolean;
    isHidden?: boolean;
    forcePasswordChange?: boolean;
    loginAttemptsBeforeLockout?: number;
    policy?: Partial<GiftistryUserPolicy>;
  }) => apiClient.patch<{ success: boolean }>(`/api/admin/users/${id}/policy`, policy, 'Policy'),

  resetPassword: (id: string, password: string, forcePasswordChange?: boolean) =>
    apiClient.post<{ success: boolean }>(`/api/admin/users/${id}/reset-password`, { password, forcePasswordChange }, 'Password'),

  unlockUser: (id: string) =>
    apiClient.post<{ success: boolean }>(`/api/admin/users/${id}/unlock`, {}),

  revokeSessions: (id: string) =>
    apiClient.post<{ success: boolean }>(`/api/admin/users/${id}/revoke-sessions`, {}),

  deleteUser: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/api/admin/users/${id}`),

  transferOwnership: (userId: string) =>
    apiClient.post<{ success: boolean; NewOwnerUsername?: string }>(
      '/api/system/transfer-ownership',
      { userId },
      'Ownership'
    ),

  getSitePolicy: () =>
    apiClient.get<{ success: boolean; Policy: SitePolicy }>('/api/admin/site-policy'),

  updateSitePolicy: (policy: SitePolicy) =>
    apiClient.patch<{ success: boolean; Policy: SitePolicy }>('/api/admin/site-policy', policy, 'SitePolicy'),

  getAuditLog: (params: { action?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params.action) q.set('action', params.action);
    if (params.page) q.set('page', String(params.page));
    const qs = q.toString();
    return apiClient.get<{ success: boolean; Entries: AuditLogEntry[]; Page: number; Total: number }>(
      `/api/admin/audit${qs ? `?${qs}` : ''}`
    );
  },

  getModerationComments: (page = 1) =>
    apiClient.get<{ success: boolean; Comments: ModerationComment[]; Page: number; Total: number }>(
      `/api/admin/moderation/comments?page=${page}`
    ),

  deleteModerationComment: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/api/admin/moderation/comments/${id}`),

  getReports: (status = 'open', page = 1) =>
    apiClient.get<{ success: boolean; Reports: ContentReport[]; Page: number; Total: number }>(
      `/api/admin/reports?status=${status}&page=${page}`
    ),

  resolveReport: (id: string, status: 'open' | 'resolved' | 'dismissed') =>
    apiClient.patch<{ success: boolean }>(`/api/admin/reports/${id}`, { status }, 'Report'),
};
