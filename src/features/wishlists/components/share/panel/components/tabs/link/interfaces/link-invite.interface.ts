export interface LinkInvite {
  Id: string;
  ListId: string;
  Token: string | null;
  Role: 'viewer' | 'collaborator';
  CreatedBy: string;
  ExpiresAt: string | Date | null;
  MaxUses: number | null;
  UseCount: number;
  RevokedAt: string | Date | null;
  PasswordProtected: boolean;
  CreatedAt: string | Date;
}
