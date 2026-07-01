import { ApiUser } from './api-user.interface';

export interface AuthResponse {
  success: boolean;
  User?: ApiUser;
  Token?: string;
  Require2FA?: boolean;
  Ticket?: string;
  Code?: string;
}
