import { apiClient } from 'core/api/client';
import { AUTH_TOKEN_STORAGE_KEY } from 'core/api/constants/token-storage-key.constant';
import { env } from 'core/config/env';
import { ApiUser } from '../interfaces/api-user.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { OnboardingPatchPayload } from '../interfaces/onboarding-patch-payload.interface';
import { OnboardingState } from '../interfaces/onboarding-state.interface';
import type { Passkey } from '../interfaces/passkey.interface';
import type { TourState } from '../interfaces/tour-state.interface';
import type { TutorialPatchPayload } from '../interfaces/tutorial-patch-payload.interface';

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { Username: username, Password: password }, 'Auth'),

  signup: (
    username: string,
    email: string | null | undefined,
    password: string,
    firstName?: string,
    lastName?: string,
    inviteToken?: string | null
  ) =>
    apiClient.post<AuthResponse>(
      '/api/auth/signup',
      {
        Username: username,
        ...(email ? { Email: email } : {}),
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        ...(inviteToken ? { InviteToken: inviteToken } : {}),
      },
      'Auth'
    ),

  logout: () =>
    apiClient.post<Record<string, never>>('/api/auth/logout', {}),

  getMe: () =>
    apiClient.get<{ User: ApiUser; Capabilities?: { CanUseAi: boolean; CanUseWebSearch: boolean } }>('/api/auth/me'),

  updateProfile: (
    username?: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    theme?: string,
    avatar?: string | null,
    aiEnabled?: boolean,
    webSearchEnabled?: boolean
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
        WebSearchEnabled: webSearchEnabled,
      },
      'Auth'
    ),

  getUserPreview: (userId: string) =>
    apiClient.get<{ User: ApiUser }>(`/api/users/${userId}/preview`),

  passkeyRegisterOptions: () =>
    apiClient.post<{ Options: unknown }>('/api/auth/passkey/register/options', {}),

  passkeyRegisterVerify: (registrationResponse: unknown) =>
    apiClient.post<Record<string, never>>('/api/auth/passkey/register/verify', { RegistrationResponse: registrationResponse }, 'Auth'),

  passkeyLoginOptions: () =>
    apiClient.post<{ Options: unknown }>('/api/auth/passkey/login/options', {}),

  passkeyLoginVerify: (authenticationResponse: unknown) =>
    apiClient.post<AuthResponse>('/api/auth/passkey/login/verify', { AuthenticationResponse: authenticationResponse }, 'Auth'),

  checkPasskey: (username: string) =>
    apiClient.post<{ HasPasskey: boolean }>('/api/auth/passkey/check', { Username: username }, 'Auth'),

  verify2faLogin: (ticket: string, code: string) =>
    apiClient.post<AuthResponse>('/api/auth/2fa/login', { Ticket: ticket, Code: code }, 'Auth'),

  setup2fa: () =>
    apiClient.post<{ Secret: string; QrCodeUrl: string }>('/api/auth/2fa/setup', {}),

  enable2fa: (secret: string, code: string) =>
    apiClient.post<{ RecoveryCodes?: string[] }>('/api/auth/2fa/enable', { Secret: secret, Code: code }, 'Auth'),

  disable2fa: (code: string) =>
    apiClient.post<Record<string, never>>('/api/auth/2fa/disable', { Code: code }, 'Auth'),

  getPasskeys: () =>
    apiClient.get<{ Passkeys: Passkey[] }>('/api/auth/passkeys'),

  deletePasskey: (passkeyId: string) =>
    apiClient.delete<Record<string, never>>(`/api/auth/passkeys/${passkeyId}`),

  disableAccount: () =>
    apiClient.post<Record<string, never>>('/api/auth/account/disable', {}, 'Auth'),

  deleteAccount: (password: string) =>
    apiClient.delete<Record<string, never>>('/api/auth/account', { Password: password }, 'Auth'),

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await apiClient.post<AuthResponse>(
      '/api/auth/password',
      { CurrentPassword: currentPassword, NewPassword: newPassword },
      'Auth'
    );
    if (res?.Token) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, res.Token);
    }
    return res;
  },

  getOnboardingState: () =>
    apiClient.get<OnboardingState>('/api/auth/onboarding'),

  patchOnboarding: (payload: OnboardingPatchPayload) =>
    apiClient.patch<OnboardingState & { User?: ApiUser }>('/api/auth/onboarding', payload, 'Onboarding'),

  patchTutorial: (payload: TutorialPatchPayload) =>
    apiClient.patch<{ Tour: TourState; User: ApiUser }>('/api/auth/tutorial', payload, 'Tutorial'),

  beginOauthLogin: (inviteToken?: string | null) => {
    const qs =
      inviteToken && inviteToken.trim()
        ? `?invite=${encodeURIComponent(inviteToken.trim())}`
        : '';
    window.location.href = `${env.apiUrl}/api/auth/oauth/authorize${qs}`;
  },

  validateRegistrationInvite: (token: string) =>
    apiClient.get<{ Valid: boolean; ExpiresAt: string | null }>(
      `/api/auth/registration-invite/${encodeURIComponent(token)}`
    ),
};
