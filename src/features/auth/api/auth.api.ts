import { apiClient } from 'core/api/client';
import { ApiUser } from '../interfaces/api-user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { email, password }, 'Auth'),

  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) =>
    apiClient.post<AuthResponse>('/api/auth/signup', { username, email, password, firstName, lastName }, 'Auth'),

  logout: () =>
    apiClient.post<{ success: boolean }>('/api/auth/logout', {}),

  getMe: () =>
    apiClient.get<{ success: boolean; User: ApiUser }>('/api/auth/me'),

  updateProfile: (username?: string, firstName?: string, lastName?: string, bio?: string, theme?: string, avatar?: string | null) =>
    apiClient.put<{ success: boolean; User: ApiUser }>('/api/auth/profile', { username, firstName, lastName, bio, theme, avatar }, 'Auth'),

  getUserPreview: (userId: string) =>
    apiClient.get<{ success: boolean; User: ApiUser }>(`/api/users/${userId}/preview`),

  verifyEmail: (token: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/verify-email', { token }, 'Auth'),

  resendVerification: (email: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/resend-verification', { email }, 'Auth'),

  passkeyRegisterOptions: () =>
    apiClient.post<{ success: boolean; options: any }>('/api/auth/passkey/register/options', {}),

  passkeyRegisterVerify: (registrationResponse: any) =>
    apiClient.post<{ success: boolean }>('/api/auth/passkey/register/verify', { registrationResponse }, 'Auth'),

  passkeyLoginOptions: () =>
    apiClient.post<{ success: boolean; options: any }>('/api/auth/passkey/login/options', {}),

  passkeyLoginVerify: (authenticationResponse: any) =>
    apiClient.post<AuthResponse>('/api/auth/passkey/login/verify', { authenticationResponse }, 'Auth'),

  ssoGitHub: () => {
    window.location.href = 'http://localhost:3001/api/auth/sso/github';
  },

  ssoEmailOtp: (email: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/sso/email-otp', { email }, 'Auth'),

  ssoEmailVerify: (email: string, token: string) =>
    apiClient.post<AuthResponse>('/api/auth/sso/email-verify', { email, token }, 'Auth'),

  verify2faLogin: (ticket: string, code: string) =>
    apiClient.post<AuthResponse>('/api/auth/2fa/login', { ticket, code }, 'Auth'),

  setup2fa: () =>
    apiClient.post<{ success: boolean; Secret: string; QrCodeUrl: string }>('/api/auth/2fa/setup', {}),

  enable2fa: (secret: string, code: string) =>
    apiClient.post<{ success: boolean; RecoveryCodes?: string[] }>('/api/auth/2fa/enable', { secret, code }, 'Auth'),

  disable2fa: (code: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/2fa/disable', { code }, 'Auth'),

  getPasskeys: () =>
    apiClient.get<{ success: boolean; Passkeys: any[] }>('/api/auth/passkeys'),

  deletePasskey: (passkeyId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/auth/passkeys/${passkeyId}`),
};
