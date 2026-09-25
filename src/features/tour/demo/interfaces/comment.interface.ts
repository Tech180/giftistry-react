export interface Comment {
  Id: string;
  ListId: string;
  UserId: string;
  Username: string;
  Body: string;
  CreatedAt: string;
  ParentId?: string | null;
}
