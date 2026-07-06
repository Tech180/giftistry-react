import { PublicUserSummary } from 'shared/interfaces/public-user-summary.interface';

export interface ApiUser extends PublicUserSummary {
  Id: string;
  Email: string;
  EmailVerified?: boolean;
  TwoFactorEnabled?: boolean;
  IsAdmin?: boolean;
}
