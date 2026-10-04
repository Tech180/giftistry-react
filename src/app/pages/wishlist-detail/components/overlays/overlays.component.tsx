import React from 'react';
import { resolveApplyBarButtonLabel } from '../../utils/resolve-apply-bar-button-label.util';
import type { Props } from './interfaces/props.interface';
import { OverlaysTemplate } from './overlays.html';

export const Overlays: React.FC<Props> = (props) => {
  const applyBarButtonLabel = resolveApplyBarButtonLabel({
    collapseDrawerWhileTagging: props.collapseDrawerWhileTagging,
    isItemFormSessionActive: props.isItemFormSessionActive,
    isLinkingModeActive: props.isLinkingModeActive,
    isRelatingModeActive: props.isRelatingModeActive,
    isReplyTaggingModeActive: props.isReplyTaggingModeActive,
    taggedItemIds: props.taggedItemIds,
    replyTaggedItemIds: props.replyTaggedItemIds,
  });

  return (
    <OverlaysTemplate
      {...props}
      applyBarButtonLabel = {
        applyBarButtonLabel
      }
    />
  );
};
