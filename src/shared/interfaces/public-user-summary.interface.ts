export interface PublicUserSummary {
  Username: string;
  FirstName: string;
  LastName: string;
  Avatar?: string | null;
  LastOnline?: string | null;
  WishlistCount?: number;
  MutualsCount?: number;
  Birthday?: string | null;
  Bio?: string | null;
  CreatedAt?: string;
  Theme?: string | null;
}
