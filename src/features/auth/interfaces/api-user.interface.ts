import { PublicUserSummary } from 'shared/interfaces/public-user-summary.interface';
import { GiftistryUserPolicy } from 'features/admin/interfaces/giftistry-user-policy.interface';

export interface ApiUser extends PublicUserSummary {
  Id: string;
  Email: string;
  EmailVerified?: boolean;
  TwoFactorEnabled?: boolean;
  IsAdmin?: boolean;
  IsOwner?: boolean;
  AiEnabled?: boolean;
  WebSearchEnabled?: boolean;
  Policy?: GiftistryUserPolicy;
}
