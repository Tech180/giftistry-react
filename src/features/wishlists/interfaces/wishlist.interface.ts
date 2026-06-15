export interface Wishlist {
  Id: string;
  UserId: string;
  Title: string;
  ExpiresAt: string | null;
  AllowGroupFunds: boolean;
  IsActive: boolean;
  CreatedAt?: string;
  OwnerUsername?: string; // Appended if available
}

export interface ListShare {
  Id: string;
  ListId: string;
  UserId: string;
  Role: 'collaborator' | 'viewer';
  CreatedAt?: string;
}
