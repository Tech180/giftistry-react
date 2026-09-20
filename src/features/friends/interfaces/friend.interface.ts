export interface Friend {
  Id: string;
  UserId: string;
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Avatar: string | null;
  FriendsSince?: string;
  Birthday?: string | null;
  WishlistCount?: number;
  MutualsCount?: number;
  RecentActivity?: string;
  DaysUntilBirthday?: number;
  LastOnline?: string | null;
}
