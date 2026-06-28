export interface ApiUser {
  Id: string;
  Username: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CreatedAt?: string;
  Bio?: string;
  Theme?: string;
  Avatar?: string | null;
}
