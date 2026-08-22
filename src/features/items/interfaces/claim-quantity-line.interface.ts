export interface ClaimQuantityLine {
  selection: string | null;
  name: string;
  claimedByUser: number;
  claimedByOthers: number;
  capacity: number;
  maxForUser: number;
}
