export interface Claim {
  Id: string;
  ItemId: string;
  UserId: string | null;
  Amount: number | null;
  ClaimedByName: string | null;
  ClaimedAt?: string;
}
