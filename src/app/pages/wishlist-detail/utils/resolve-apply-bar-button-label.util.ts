import type {
  ApplyBarButtonLabel,
  ResolveApplyBarButtonLabelInput,
} from '../interfaces/resolve-apply-bar-button-label-input.interface';

/**
 * Label for the floating apply bar. Comment tagging (collapsed drawer) shows Cancel until
 * at least one item is selected. Link/relate association bars always use Apply.
 */
export function resolveApplyBarButtonLabel(
  input: ResolveApplyBarButtonLabelInput
): ApplyBarButtonLabel {
  const isAssociationBar =
    input.isItemFormSessionActive &&
    (input.isLinkingModeActive || input.isRelatingModeActive);

  if (isAssociationBar) {
    return 'Apply';
  }

  if (input.collapseDrawerWhileTagging) {
    const activeTaggedIds = input.isReplyTaggingModeActive
      ? input.replyTaggedItemIds
      : input.taggedItemIds;

    if (activeTaggedIds.length === 0) {
      return 'Cancel';
    }
  }

  return 'Apply';
}
