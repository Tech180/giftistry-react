import React from 'react';
import {
  CLAIM_GF_AMOUNT_LABEL,
  CLAIM_GF_AMOUNT_PLACEHOLDER,
  CLAIM_GF_CONTRIBUTE_LABEL,
  CLAIM_GF_REMAINING_HELPER,
  CLAIM_GF_START_LABEL,
} from './constants/claim-group-fund-copy.constant';
import type { Props } from './interfaces/props.interface';
import { ClaimPromptTemplate } from './claim-prompt.html';

export const ClaimPrompt: React.FC<Props> = ({
  anonymous,
  onAnonymousChange,
  prompt = 'Claim this item?',
  showGroupFunding = false,
  groupFundingStarted = false,
  groupFundingEnabled = false,
  onGroupFundingEnabledChange,
  claimAmount = '',
  onClaimAmountChange,
  remainingAmount = 0,
  amountInputId = 'claim-group-fund-amount',
}) => {
  const gfPathActive = showGroupFunding && (groupFundingStarted || groupFundingEnabled);
  const gfToggleLabel = groupFundingStarted ? CLAIM_GF_CONTRIBUTE_LABEL : CLAIM_GF_START_LABEL;

  return (
    <ClaimPromptTemplate
      anonymous = {
        anonymous
      }
      onAnonymousChange = {
        onAnonymousChange
      }
      prompt = {
        prompt
      }
      showGroupFunding = {
        showGroupFunding
      }
      gfPathActive = {
        gfPathActive
      }
      gfToggleLabel = {
        gfToggleLabel
      }
      switchChecked = {
        groupFundingStarted || groupFundingEnabled
      }
      switchDisabled = {
        groupFundingStarted
      }
      onGroupFundingEnabledChange = {
        onGroupFundingEnabledChange
      }
      claimAmount = {
        claimAmount
      }
      onClaimAmountChange = {
        onClaimAmountChange
      }
      remainingHint = {
        CLAIM_GF_REMAINING_HELPER(remainingAmount)
      }
      amountLabel = {
        CLAIM_GF_AMOUNT_LABEL
      }
      amountPlaceholder = {
        CLAIM_GF_AMOUNT_PLACEHOLDER
      }
      amountInputId = {
        amountInputId
      }
      amountMax = {
        remainingAmount > 0 ? remainingAmount : undefined
      }
    />
  );
};
