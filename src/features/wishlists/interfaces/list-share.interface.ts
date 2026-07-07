export interface ListShare {
  Id: string;
  ListId: string;
  UserId: string;
  Role: 'collaborator' | 'viewer';
  CreatedAt?: string;
  Username?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Avatar?: string | null;
}
