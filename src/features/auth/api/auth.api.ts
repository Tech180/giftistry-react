import { apiClient } from 'core/api/client';
import { ApiUser } from '../interfaces/api-user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { Email: email, Password: password }, 'Auth'),

  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) =>
    apiClient.post<AuthResponse>('/api/auth/signup', { Username: username, Email: email, Password: password, FirstName: firstName, LastName: lastName }, 'Auth'),

  logout: () =>
    apiClient.post<{ success: boolean }>('/api/auth/logout', {}),

  getMe: () =>
    apiClient.get<{ User: ApiUser }>('/api/auth/me'),

  updateProfile: (
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    theme?: string,
    avatar?: string | null,
    aiEnabled?: boolean
  ) =>
    apiClient.put<{ User: ApiUser }>(
      '/api/auth/profile',
      {
        Username: username,
        FirstName: firstName,
        LastName: lastName,
        Bio: bio,
        Theme: theme,
        Avatar: avatar,
        AiEnabled: aiEnabled,
      },
      'Auth'
    ),

  getUserPreview: (userId: string) =>
    apiClient.get<{ User: ApiUser }>(`/api/users/${userId}/preview`),

  verifyEmail: (token: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/verify-email', { Token: token }, 'Auth'),

  resendVerification: () =>
    apiClient.post<{ success: boolean }>('/api/auth/resend-verification', {}),

  passkeyRegisterOptions: () =>
    apiClient.post<{ Options: unknown }>('/api/auth/passkey/register/options', {}),

  passkeyRegisterVerify: (registrationResponse: unknown) =>
    apiClient.post<{ success: boolean }>('/api/auth/passkey/register/verify', { RegistrationResponse: registrationResponse }, 'Auth'),

  passkeyLoginOptions: () =>
    apiClient.post<{ Options: unknown }>('/api/auth/passkey/login/options', {}),

  passkeyLoginVerify: (authenticationResponse: unknown) =>
    apiClient.post<AuthResponse>('/api/auth/passkey/login/verify', { AuthenticationResponse: authenticationResponse }, 'Auth'),

  verify2faLogin: (ticket: string, code: string) =>
    apiClient.post<AuthResponse>('/api/auth/2fa/login', { Ticket: ticket, Code: code }, 'Auth'),

  setup2fa: () =>
    apiClient.post<{ Secret: string; QrCodeUrl: string }>('/api/auth/2fa/setup', {}),

  enable2fa: (secret: string, code: string) =>
    apiClient.post<{ RecoveryCodes?: string[] }>('/api/auth/2fa/enable', { Secret: secret, Code: code }, 'Auth'),

  disable2fa: (code: string) =>
    apiClient.post<{ success: boolean }>('/api/auth/2fa/disable', { Code: code }, 'Auth'),

  getPasskeys: () =>
    apiClient.get<{ Passkeys: unknown[] }>('/api/auth/passkeys'),

  deletePasskey: (passkeyId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/auth/passkeys/${passkeyId}`),

  disableAccount: () =>
    apiClient.post<{ success: boolean }>('/api/auth/account/disable', {}, 'Auth'),

  deleteAccount: (password: string) =>
    apiClient.delete<{ success: boolean }>('/api/auth/account', { Password: password }, 'Auth'),
};
