export type RegistrationInviteListStatus = 'active' | 'completed' | 'expired';

export interface RegistrationInviteListItem {
  Id: string;
  Url: string | null;
  Status: RegistrationInviteListStatus;
  ExpiresAt: string;
  MaxUses: number | null;
  UseCount: number;
  CreatedAt: string;
}

export interface RegistrationInviteStatus {
  HasActiveInvite: boolean;
  IsExpired: boolean;
  IsCompleted: boolean;
  ExpiresAt: string | null;
  MaxUses: number | null;
  UseCount: number;
  CreatedAt: string | null;
  Invites: RegistrationInviteListItem[];
}

export interface RegistrationInviteRegenerateResult {
  Id: string;
  Token: string;
  ExpiresAt: string;
  Url: string;
}
