export interface UserListItem {
  Id: string;
  Username: string;
  Email: string | null;
  IsOwner: boolean;
  IsAdmin: boolean;
  IsDisabled: boolean;
  LockedUntil: string | null;
  ActiveListsCount: number;
  LastLoginAt: string | null;
  LastOnline: string | null;
}
