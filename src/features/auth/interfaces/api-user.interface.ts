import { PublicUserSummary } from 'shared/interfaces/public-user-summary.interface';
import type { GiftistryUserPolicy } from 'features/admin';
import type { TourState } from './tour-state.interface';

export interface ApiUser extends PublicUserSummary {
  Id: string;
  Email: string | null;
  EmailVerified?: boolean;
  TwoFactorEnabled?: boolean;
  IsAdmin?: boolean;
  IsOwner?: boolean;
  AiEnabled?: boolean;
  WebSearchEnabled?: boolean;
  Policy?: GiftistryUserPolicy;
  HasPasskey?: boolean;
  IsOnboarded?: boolean;
  ForcePasswordChange?: boolean;
  Tour?: TourState;
}
