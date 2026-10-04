import React, { useEffect, useRef, useState } from 'react';
import { OWNER_DEFAULT_COMMENT_VISIBILITY } from '../../../../constants/default-comment-visibility.constant';
import { COMMENTS_SHEET_MOBILE_QUERY } from '../../../../constants/sheet-mobile-query.constant';
import { canChooseCommentVisibilityAudience } from '../../../../utils/can-choose-comment-visibility-audience.util';
import { resolveCommentVisibilityBadgeLabel } from '../../../../utils/resolve-comment-visibility-badge-label.util';
import { FooterProps } from './interfaces/footer-props.interface';
import { FooterTemplate } from './footer.html';

export const InputFooter: React.FC<FooterProps> = (props) => {
  const {
    isOwner,
    commentVisibility,
    setCommentVisibility,
    participants,
    currentUserId,
    setIsRollover,
    isRollover,
    autoRollover,
    items,
    showTagModeToggle,
    footerLayout,
    isTaggingModeActive,
    setIsTaggingModeActive,
    listOwnerId,
  } = props;

  const anchorRef = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(COMMENTS_SHEET_MOBILE_QUERY).matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia(COMMENTS_SHEET_MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const isChooseWhoEnabled = canChooseCommentVisibilityAudience({
    participants,
    currentUserId,
    isOwner,
  });

  useEffect(() => {
    if (!isOwner || isChooseWhoEnabled || commentVisibility.mode !== 'visibleToSelected') {
      return;
    }

    setCommentVisibility(OWNER_DEFAULT_COMMENT_VISIBILITY);
  }, [commentVisibility.mode, isChooseWhoEnabled, isOwner, setCommentVisibility]);

  const isVisibilityPickerEnabled = !isOwner || isChooseWhoEnabled;
  const isPanelOpenForView = isPanelOpen && isVisibilityPickerEnabled;

  const badgeLabel = resolveCommentVisibilityBadgeLabel(commentVisibility.mode);

  return (
    <FooterTemplate
      isOwner={isOwner}
      commentVisibility={commentVisibility}
      setCommentVisibility={setCommentVisibility}
      isRollover={isRollover}
      setIsRollover={setIsRollover}
      autoRollover={autoRollover}
      items={items}
      showTagModeToggle={showTagModeToggle ?? true}
      footerLayout={footerLayout ?? 'default'}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={setIsTaggingModeActive}
      participants={participants}
      currentUserId={currentUserId}
      listOwnerId={listOwnerId}
      isPanelOpen={isPanelOpenForView}
      setIsPanelOpen={setIsPanelOpen}
      isMobile={isMobile}
      isChooseWhoEnabled={isChooseWhoEnabled}
      isVisibilityPickerEnabled={isVisibilityPickerEnabled}
      badgeLabel={badgeLabel}
      anchorRef={anchorRef}
    />
  );
};
