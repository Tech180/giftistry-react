export interface ClaimPromptProps {
  anonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
  prompt?: string;
  /** Show group-funding controls when list allows GF and item has a price target. */
  showGroupFunding?: boolean;
  /** True when prior contributions exist — toggle forced on. */
  groupFundingStarted?: boolean;
  groupFundingEnabled?: boolean;
  onGroupFundingEnabledChange?: (enabled: boolean) => void;
  claimAmount?: string;
  onClaimAmountChange?: (value: string) => void;
  remainingAmount?: number;
  amountInputId?: string;
}
