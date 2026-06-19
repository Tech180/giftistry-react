import { ApiUser } from './api-user.interface';

export interface AuthResponse {
  success: boolean;
  User: ApiUser;
  Token: string;
}
