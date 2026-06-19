export interface Wishlist {
  Id: string;
  UserId: string;
  Title: string;
  ExpiresAt: string | null;
  AllowGroupFunds: boolean;
  IsActive: boolean;
  CreatedAt?: string;
  OwnerUsername?: string; // Appended if available
  Category?: string;
  RevealSuggestions?: boolean;
  OwnerFirstName?: string;
  Role?: 'owner' | 'collaborator' | 'viewer';
}
