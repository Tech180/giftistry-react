import { apiClient } from 'core/api/client';
import { ApiUser } from './api-user.interface';

export interface AuthResponse {
  User?: ApiUser;
  Token?: string;
  Require2FA?: boolean;
  Ticket?: string;
}
