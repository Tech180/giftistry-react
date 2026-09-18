export interface ListParticipant {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  role?: 'owner' | 'collaborator' | 'viewer';
}
