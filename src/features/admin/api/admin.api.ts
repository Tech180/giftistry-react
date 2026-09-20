import { apiClient } from 'core/api/client';
import type { AuditLogListResponse } from '../interfaces/audit-log-list-response.interface';
import type { CreateUserPayload } from '../interfaces/create-user-payload.interface';
import type { CreateUserResponse } from '../interfaces/create-user-response.interface';
import type { GetAuditLogParams } from '../interfaces/get-audit-log-params.interface';
import type { GetUserResponse } from '../interfaces/get-user-response.interface';
import type { ListUsersParams } from '../interfaces/list-users-params.interface';
import type { ModerationCommentsResponse } from '../interfaces/moderation-comments-response.interface';
import type { OverviewResponse } from '../interfaces/overview-response.interface';
import type { RegistrationInviteRegenerateResult } from '../interfaces/registration-invite-regenerate-result.interface';
import type { RegistrationInviteStatus } from '../interfaces/registration-invite-status.interface';
import type { ReportStatus } from '../interfaces/report-status.type';
import type { ReportsListResponse } from '../interfaces/reports-list-response.interface';
import type { SitePolicy } from '../interfaces/site-policy.interface';
import type { SitePolicyResponse } from '../interfaces/site-policy-response.interface';
import type { TransferOwnershipResponse } from '../interfaces/transfer-ownership-response.interface';
import type { UpdateUserPayload } from '../interfaces/update-user-payload.interface';
import type { UpdateUserPolicyPayload } from '../interfaces/update-user-policy-payload.interface';
import type { UserListResponse } from '../interfaces/user-list-response.interface';

export const adminApi = {
  getOverview: () => apiClient.get<OverviewResponse>('/api/admin/overview'),

  listUsers: (params: ListUsersParams) => {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.disabled) q.set('disabled', params.disabled);
    if (params.locked) q.set('locked', params.locked);
    if (params.admin) q.set('admin', params.admin);
    if (params.page) q.set('page', String(params.page));
    const qs = q.toString();
    return apiClient.get<UserListResponse>(`/api/admin/users${qs ? `?${qs}` : ''}`);
  },

  getUser: (id: string) => apiClient.get<GetUserResponse>(`/api/admin/users/${id}`),

  createUser: (payload: CreateUserPayload) => {
    const email = payload.email?.trim() ?? '';
    return apiClient.post<CreateUserResponse>(
      '/api/admin/users',
      {
        Username: payload.username,
        Email: email,
        Password: payload.password,
        FirstName: payload.firstName,
        LastName: payload.lastName,
        IsAdmin: payload.isAdmin,
        EmailVerified: email ? payload.emailVerified : false,
        ForcePasswordChange: payload.forcePasswordChange,
        Policy: payload.policy,
      },
      'AdminUser',
    );
  },

  updateUser: (id: string, updates: UpdateUserPayload) =>
    apiClient.patch<Record<string, never>>(
      `/api/admin/users/${id}`,
      {
        Username: updates.username,
        Email: updates.email,
        FirstName: updates.firstName,
        LastName: updates.lastName,
        Bio: updates.bio,
        Avatar: updates.avatar,
        EmailVerified: updates.emailVerified,
      },
      'User',
    ),

  updateUserPolicy: (id: string, policy: UpdateUserPolicyPayload) =>
    apiClient.patch<Record<string, never>>(
      `/api/admin/users/${id}/policy`,
      {
        IsAdmin: policy.isAdmin,
        IsDisabled: policy.isDisabled,
        IsHidden: policy.isHidden,
        ForcePasswordChange: policy.forcePasswordChange,
        LoginAttemptsBeforeLockout: policy.loginAttemptsBeforeLockout,
        Policy: policy.policy,
      },
      'Policy',
    ),

  resetPassword: (id: string, password: string, forcePasswordChange?: boolean) =>
    apiClient.post<Record<string, never>>(
      `/api/admin/users/${id}/reset-password`,
      { Password: password, ForcePasswordChange: forcePasswordChange },
      'Password',
    ),

  unlockUser: (id: string) =>
    apiClient.post<Record<string, never>>(`/api/admin/users/${id}/unlock`, {}),

  revokeSessions: (id: string) =>
    apiClient.post<Record<string, never>>(`/api/admin/users/${id}/revoke-sessions`, {}),

  deleteUser: (id: string) => apiClient.delete<Record<string, never>>(`/api/admin/users/${id}`),

  transferOwnership: (userId: string) =>
    apiClient.post<TransferOwnershipResponse>(
      '/api/system/transfer-ownership',
      { UserId: userId },
      'Ownership',
    ),

  getSitePolicy: () => apiClient.get<SitePolicyResponse>('/api/admin/site-policy'),

  updateSitePolicy: (policy: SitePolicy) =>
    apiClient.patch<SitePolicyResponse>('/api/admin/site-policy', policy, 'SitePolicy'),

  getRegistrationInvite: () =>
    apiClient.get<RegistrationInviteStatus>('/api/admin/registration-invite'),

  regenerateRegistrationInvite: () =>
    apiClient.post<RegistrationInviteRegenerateResult>(
      '/api/admin/registration-invite/regenerate',
      {},
    ),

  deleteRegistrationInvite: (id: string) =>
    apiClient.delete<Record<string, never>>(`/api/admin/registration-invite/${id}`),

  getAuditLog: (params: GetAuditLogParams) => {
    const q = new URLSearchParams();
    if (params.action) q.set('action', params.action);
    if (params.page) q.set('page', String(params.page));
    const qs = q.toString();
    return apiClient.get<AuditLogListResponse>(`/api/admin/audit${qs ? `?${qs}` : ''}`);
  },

  getModerationComments: (page = 1) =>
    apiClient.get<ModerationCommentsResponse>(`/api/admin/moderation/comments?page=${page}`),

  deleteModerationComment: (id: string) =>
    apiClient.delete<Record<string, never>>(`/api/admin/moderation/comments/${id}`),

  getReports: (status: ReportStatus = 'open', page = 1) =>
    apiClient.get<ReportsListResponse>(`/api/admin/reports?status=${status}&page=${page}`),

  resolveReport: (id: string, status: ReportStatus) =>
    apiClient.patch<Record<string, never>>(`/api/admin/reports/${id}`, { Status: status }, 'Report'),
};
