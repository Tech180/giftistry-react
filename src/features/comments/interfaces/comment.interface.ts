export interface Comment {
  Id: string;
  ListId: string;
  UserId: string | null;
  CommenterName: string;
  Content: string;
  IsOwnerVisible: boolean;
  IsRollover: boolean;
  IsDeleted?: boolean;
  ParentId?: string | null;
  ImageUrl?: string | null;
  Reactions?: { UserId: string; Username: string; Reaction: string }[];
  CreatedAt?: string;
}
