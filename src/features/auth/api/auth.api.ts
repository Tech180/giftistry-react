import { apiClient } from 'api/client';
import { ApiUser, AuthResponse } from '../interfaces/api-user.interface';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { email, password }, 'Auth'),

  signup: (username: string, email: string, password: string, firstName?: string, lastName?: string) =>
    apiClient.post<AuthResponse>('/api/auth/signup', { username, email, password, firstName, lastName }, 'Auth'),

  logout: () =>
    apiClient.post<{ success: boolean }>('/api/auth/logout', {}),

  getMe: () =>
    apiClient.get<{ success: boolean; User: ApiUser }>('/api/auth/me'),

  updateProfile: (username?: string, firstName?: string, lastName?: string) =>
    apiClient.put<{ success: boolean; User: ApiUser }>('/api/auth/profile', { username, firstName, lastName }, 'Auth'),
};
