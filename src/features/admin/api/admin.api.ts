import { apiClient } from 'core/api/client';
import { AdminUser, AdminUserListResponse, AdminOverviewStats } from '../interfaces/admin-user.interface';
import { AuditLogEntry } from '../interfaces/audit-log-entry.interface';
import { ContentReport } from '../interfaces/content-report.interface';
import { GiftistryUserPolicy } from '../interfaces/giftistry-user-policy.interface';
import { ModerationComment } from '../interfaces/moderation-comment.interface';
import { SitePolicy } from '../interfaces/site-policy.interface';

export const adminApi = {
  getOverview: () =>
    apiClient.get<{ Stats: AdminOverviewStats; RecentAudit: AuditLogEntry[] }>('/api/admin/overview'),

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
    apiClient.get<{ User: AdminUser; Activity: AuditLogEntry[] }>(`/api/admin/users/${id}`),

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
  }) => apiClient.post<{ UserId: string }>('/api/admin/users', {
    Username: payload.username,
    Email: payload.email,
    Password: payload.password,
    FirstName: payload.firstName,
    LastName: payload.lastName,
    IsAdmin: payload.isAdmin,
    EmailVerified: payload.emailVerified,
    ForcePasswordChange: payload.forcePasswordChange,
    Policy: payload.policy,
  }, 'AdminUser'),

  updateUser: (id: string, updates: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string | null;
    emailVerified?: boolean;
  }) =>
    apiClient.patch<Record<string, never>>(`/api/admin/users/${id}`, {
      Username: updates.username,
      Email: updates.email,
      FirstName: updates.firstName,
      LastName: updates.lastName,
      Bio: updates.bio,
      Avatar: updates.avatar,
      EmailVerified: updates.emailVerified,
    }, 'User'),

  updateUserPolicy: (id: string, policy: {
    isAdmin?: boolean;
    isDisabled?: boolean;
    isHidden?: boolean;
    forcePasswordChange?: boolean;
    loginAttemptsBeforeLockout?: number;
    policy?: Partial<GiftistryUserPolicy>;
  }) => apiClient.patch<Record<string, never>>(`/api/admin/users/${id}/policy`, {
    IsAdmin: policy.isAdmin,
    IsDisabled: policy.isDisabled,
    IsHidden: policy.isHidden,
    ForcePasswordChange: policy.forcePasswordChange,
    LoginAttemptsBeforeLockout: policy.loginAttemptsBeforeLockout,
    Policy: policy.policy,
  }, 'Policy'),

  resetPassword: (id: string, password: string, forcePasswordChange?: boolean) =>
    apiClient.post<Record<string, never>>(`/api/admin/users/${id}/reset-password`, { Password: password, ForcePasswordChange: forcePasswordChange }, 'Password'),

  unlockUser: (id: string) =>
    apiClient.post<Record<string, never>>(`/api/admin/users/${id}/unlock`, {}),

  revokeSessions: (id: string) =>
    apiClient.post<Record<string, never>>(`/api/admin/users/${id}/revoke-sessions`, {}),

  deleteUser: (id: string) =>
    apiClient.delete<Record<string, never>>(`/api/admin/users/${id}`),

  transferOwnership: (userId: string) =>
    apiClient.post<{ NewOwnerUsername?: string }>(
      '/api/system/transfer-ownership',
      { UserId: userId },
      'Ownership'
    ),

  getSitePolicy: () =>
    apiClient.get<{ Policy: SitePolicy }>('/api/admin/site-policy'),

  updateSitePolicy: (policy: SitePolicy) =>
    apiClient.patch<{ Policy: SitePolicy }>('/api/admin/site-policy', policy, 'SitePolicy'),

  getAuditLog: (params: { action?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params.action) q.set('action', params.action);
    if (params.page) q.set('page', String(params.page));
    const qs = q.toString();
    return apiClient.get<{ Entries: AuditLogEntry[]; Page: number; Total: number }>(
      `/api/admin/audit${qs ? `?${qs}` : ''}`
    );
  },

  getModerationComments: (page = 1) =>
    apiClient.get<{ Comments: ModerationComment[]; Page: number; Total: number }>(
      `/api/admin/moderation/comments?page=${page}`
    ),

  deleteModerationComment: (id: string) =>
    apiClient.delete<Record<string, never>>(`/api/admin/moderation/comments/${id}`),

  getReports: (status = 'open', page = 1) =>
    apiClient.get<{ Reports: ContentReport[]; Page: number; Total: number }>(
      `/api/admin/reports?status=${status}&page=${page}`
    ),

  resolveReport: (id: string, status: 'open' | 'resolved' | 'dismissed') =>
    apiClient.patch<Record<string, never>>(`/api/admin/reports/${id}`, { Status: status }, 'Report'),
};
