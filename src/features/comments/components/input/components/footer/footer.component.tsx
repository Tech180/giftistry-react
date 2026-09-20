import React, { useEffect, useState } from 'react';
import { FooterProps } from './interfaces/footer-props.interface';
import { FooterTemplate } from './footer.html';
import { resolveCommentVisibilityBadgeLabel } from '../../../../utils/resolve-comment-visibility-badge-label.util';

const SHEET_MOBILE_QUERY = '(max-width: 48rem)';

export const InputFooter: React.FC<FooterProps> = (props) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(SHEET_MOBILE_QUERY).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(SHEET_MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const badgeLabel = resolveCommentVisibilityBadgeLabel(
    props.commentVisibility.mode,
    props.commentVisibility.selectedUserIds.length
  );

  return (
    <FooterTemplate
      isOwner = {
        props.isOwner
      }
      commentVisibility = {
        props.commentVisibility
      }
      setCommentVisibility = {
        props.setCommentVisibility
      }
      isRollover = {
        props.isRollover
      }
      setIsRollover = {
        props.setIsRollover
      }
      autoRollover = {
        props.autoRollover
      }
      items = {
        props.items
      }
      isTaggingModeActive = {
        props.isTaggingModeActive
      }
      setIsTaggingModeActive = {
        props.setIsTaggingModeActive
      }
      participants = {
        props.participants
      }
      currentUserId = {
        props.currentUserId
      }
      listOwnerId = {
        props.listOwnerId
      }
      isPanelOpen = {
        isPanelOpen
      }
      setIsPanelOpen = {
        setIsPanelOpen
      }
      isMobile = {
        isMobile
      }
      badgeLabel = {
        badgeLabel
      }
    />
  );
};
