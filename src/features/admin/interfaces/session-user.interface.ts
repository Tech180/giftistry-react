/** Minimal session fields admin hooks need from the app auth boundary. */
export interface SessionUser {
  Id: string;
  IsOwner?: boolean;
  IsAdmin?: boolean;
}
