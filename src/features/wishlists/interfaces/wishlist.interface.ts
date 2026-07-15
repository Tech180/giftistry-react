import { ListShare } from './list-share.interface';

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
  AiEnabled?: boolean;
  WebSearchEnabled?: boolean;
  OwnerFirstName?: string;
  OwnerAvatar?: string | null;
  Role?: 'owner' | 'collaborator' | 'viewer';
  ShareToken?: string | null;
  Shares?: ListShare[];
}
