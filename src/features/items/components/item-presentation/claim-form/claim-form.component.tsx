import React, { useId, useState } from 'react';
import { parseItemDescription } from 'shared/utils/parse-item-description.util';
import type { ClaimQuantityDraft } from '../../../interfaces/claim-quantity-draft.interface';
import { buildClaimMutations } from '../../../utils/build-claim-mutations.util';
import {
  claimGroupFundLeftover,
  resolveClaimGroupFundAmount,
} from '../../../utils/resolve-claim-group-fund-amount.util';
import {
  buildInitialClaimDraft,
  clampClaimQuantity,
  isClaimQuantityLineVisible,
  itemNeedsClaimQuantityUi,
  resolveClaimQuantityLines,
  unclaimedUnitsOnClaimQuantityLine,
} from '../../../utils/resolve-claim-quantity-lines.util';
import { submitClaimDraft } from '../../../utils/submit-claim-draft.util';
import { ClaimFormTemplate } from './claim-form.html';
import {
  CLAIM_FORM_CONFIRM_CLAIM,
  CLAIM_FORM_CONFIRM_FALLBACK,
  CLAIM_FORM_CONFIRM_LINKED,
  CLAIM_FORM_CONFIRM_UPDATE,
  CLAIM_FORM_PROMPT_CLAIM,
  CLAIM_FORM_PROMPT_CLAIM_LINKED,
  CLAIM_FORM_PROMPT_UPDATE,
  CLAIM_FORM_TITLE_CLAIM,
  CLAIM_FORM_TITLE_UPDATE,
} from './constants/claim-form-copy.constant';
import {
  CLAIM_GF_AMOUNT_EXCEEDS,
  CLAIM_GF_AMOUNT_REQUIRED,
  CLAIM_GF_CONFIRM_CONTRIBUTE,
} from '../claim-prompt/constants/claim-group-fund-copy.constant';
import type { ClaimFormProps } from './interfaces/claim-form-props.interface';

export const ClaimForm: React.FC<ClaimFormProps> = ({
  item,
  metadata,
  userId,
  claimedByName,
  itemActions,
  anonymous,
  onAnonymousChange,
  onSubmitted,
  onCancel,
  onBeforeSubmit,
  compact = false,
  linkedItems = [],
  wishlistItems = [],
  onLinkedItemClick,
  allowGroupFunds = false,
  fundingTarget = 0,
  totalClaimedAmount = 0,
}) => {
  const idPrefix = useId();
  const resolvedMetadata =
    metadata ?? parseItemDescription(item.Description, item.Metadata).metadata;
  const hasLinkedBundle = linkedItems.length > 0;
  const showQuantityUi =
    !hasLinkedBundle && itemNeedsClaimQuantityUi(item, resolvedMetadata);
  const lines = resolveClaimQuantityLines(item, resolvedMetadata, userId);
  const [draft, setDraft] = useState<ClaimQuantityDraft[]>(() => buildInitialClaimDraft(lines));
  const [confirmLoading, setConfirmLoading] = useState(false);
  const priorGroupFunding = totalClaimedAmount > 0;
  const [groupFundingEnabled, setGroupFundingEnabled] = useState(priorGroupFunding);
  const [claimAmount, setClaimAmount] = useState('');

  const userHasClaims = lines.some((line) => line.claimedByUser > 0);
  const submitName = anonymous ? null : claimedByName;
  const plan = buildClaimMutations({
    itemId: item.Id,
    lines,
    draft,
    claimedByName: submitName,
    anonymous,
    includeLinked: hasLinkedBundle,
  });
  const showGroupFunding =
    !showQuantityUi &&
    !hasLinkedBundle &&
    allowGroupFunds &&
    fundingTarget > 0 &&
    !resolvedMetadata?.MultiCount;
  const remainingAmount = claimGroupFundLeftover(fundingTarget, totalClaimedAmount);
  const gfPathActive = showGroupFunding && (priorGroupFunding || groupFundingEnabled);
  const parsedAmount = claimAmount.trim() ? parseFloat(claimAmount) : null;
  const amountInvalid =
    gfPathActive &&
    (parsedAmount == null ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      (remainingAmount > 0 && parsedAmount > remainingAmount + 1e-9));
  const confirmDisabled = (showQuantityUi && plan.type === 'noop') || amountInvalid;
  const visibleLines = lines.filter(isClaimQuantityLineVisible);
  const showVariationList = visibleLines.some((line) => line.selection != null);

  const quantityRows = visibleLines.map((line, index) => {
    const quantity = draft.find((entry) => entry.selection === line.selection)?.quantity ?? 0;
    const remaining = Math.max(0, line.maxForUser - quantity);
    return {
      selection: line.selection,
      name: line.name,
      inputId: `${idPrefix}-qty-${index}`,
      quantity,
      maxForUser: line.maxForUser,
      remaining,
      outOfStock: line.maxForUser <= 0,
    };
  });
  const totalRemaining = visibleLines.reduce(
    (sum, line) => sum + unclaimedUnitsOnClaimQuantityLine(line),
    0
  );

  const onQuantityChange = (selection: string | null, raw: number) => {
    const line = lines.find((entry) => entry.selection === selection);
    const nextQuantity = clampClaimQuantity(raw, line?.maxForUser ?? 0);
    setDraft((prev) => {
      const hasRow = prev.some((entry) => entry.selection === selection);
      if (!hasRow) {
        return [...prev, { selection, quantity: nextQuantity }];
      }
      return prev.map((entry) =>
        entry.selection === selection ? { ...entry, quantity: nextQuantity } : entry
      );
    });
  };

  const onSubmit = async () => {
    if (showQuantityUi) {
      if (plan.type === 'noop') {
        return;
      }
      if (onBeforeSubmit) {
        const allowed = await onBeforeSubmit(draft);
        if (!allowed) {
          return;
        }
      }
      setConfirmLoading(true);
      try {
        await submitClaimDraft({
          itemId: item.Id,
          userId,
          plan,
          itemActions,
        });
        onSubmitted();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to claim item');
      } finally {
        setConfirmLoading(false);
      }
      return;
    }

    if (gfPathActive) {
      if (parsedAmount == null || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        alert(CLAIM_GF_AMOUNT_REQUIRED);
        return;
      }
      if (remainingAmount > 0 && parsedAmount > remainingAmount + 1e-9) {
        alert(CLAIM_GF_AMOUNT_EXCEEDS);
        return;
      }
    }

    if (!hasLinkedBundle && onBeforeSubmit) {
      const allowed = await onBeforeSubmit(draft);
      if (!allowed) {
        return;
      }
    }

    const amount = resolveClaimGroupFundAmount({
      allowGroupFunds: showGroupFunding,
      fundingTarget,
      totalClaimedAmount,
      groupFundingEnabled: priorGroupFunding || groupFundingEnabled,
      amount: parsedAmount,
    });

    setConfirmLoading(true);
    try {
      await itemActions.claimItem({
        itemId: item.Id,
        amount,
        claimedByName: submitName,
        anonymous,
        includeLinked: hasLinkedBundle,
      });
      onSubmitted();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to claim item');
    } finally {
      setConfirmLoading(false);
    }
  };

  const prompt = userHasClaims
    ? CLAIM_FORM_PROMPT_UPDATE
    : hasLinkedBundle
      ? CLAIM_FORM_PROMPT_CLAIM_LINKED
      : CLAIM_FORM_PROMPT_CLAIM;

  const confirmLabel = showQuantityUi
    ? userHasClaims
      ? CLAIM_FORM_CONFIRM_UPDATE
      : CLAIM_FORM_CONFIRM_CLAIM
    : hasLinkedBundle
      ? CLAIM_FORM_CONFIRM_LINKED
      : priorGroupFunding || groupFundingEnabled
        ? CLAIM_GF_CONFIRM_CONTRIBUTE
        : CLAIM_FORM_CONFIRM_FALLBACK;

  return (
    <ClaimFormTemplate
      prompt={prompt}
      title={userHasClaims ? CLAIM_FORM_TITLE_UPDATE : CLAIM_FORM_TITLE_CLAIM}
      confirmLabel={confirmLabel}
      anonymous={anonymous}
      onAnonymousChange={onAnonymousChange}
      compact={compact}
      showQuantityUi={showQuantityUi}
      showVariationList={showVariationList}
      quantityRows={quantityRows}
      totalRemaining={totalRemaining}
      confirmDisabled={confirmDisabled}
      confirmLoading={confirmLoading}
      onQuantityChange={onQuantityChange}
      onSubmit={onSubmit}
      onCancel={onCancel}
      linkedItems={linkedItems}
      wishlistItems={wishlistItems}
      onLinkedItemClick={onLinkedItemClick}
      showGroupFunding={showGroupFunding}
      groupFundingStarted={priorGroupFunding}
      groupFundingEnabled={groupFundingEnabled}
      onGroupFundingEnabledChange={setGroupFundingEnabled}
      claimAmount={claimAmount}
      onClaimAmountChange={setClaimAmount}
      remainingAmount={remainingAmount}
      amountInputId={`${idPrefix}-gf-amount`}
    />
  );
};
