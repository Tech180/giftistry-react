export interface ClaimBadgeProps {
  userId?: string | null;
  displayName: string;
  anonymous?: boolean;
  claimedByCurrentUser?: boolean;
}
