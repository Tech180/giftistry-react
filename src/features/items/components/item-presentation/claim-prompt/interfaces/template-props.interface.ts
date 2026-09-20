export interface TemplateProps {
  anonymous: boolean;
  onAnonymousChange: (checked: boolean) => void;
  prompt: string;
  showGroupFunding: boolean;
  gfPathActive: boolean;
  gfToggleLabel: string;
  switchChecked: boolean;
  switchDisabled: boolean;
  onGroupFundingEnabledChange?: (enabled: boolean) => void;
  claimAmount: string;
  onClaimAmountChange?: (value: string) => void;
  remainingHint: string;
  amountLabel: string;
  amountPlaceholder: string;
  amountInputId: string;
  amountMax?: number;
}
