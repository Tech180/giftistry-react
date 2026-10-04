import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { COMMENT_VISIBILITY_CHOOSE_WHO_DISABLED_HELP } from '../../../../constants/comment-visibility-labels.constant';
import {
  VISIBILITY_PANEL_POPOVER_ESTIMATED_HEIGHT,
  VISIBILITY_PANEL_POPOVER_ESTIMATED_HEIGHT_EXPANDED,
} from '../../../../constants/visibility-panel-popover-estimated-height.constant';
import type { CommentVisibilityMode } from '../../../../interfaces/comment-visibility-mode.type';
import { resolveParticipantRoleLabel } from '../../../../utils/resolve-participant-role-label.util';
import { AnchoredPopover } from '../toolbar/anchored-popover/anchored-popover.component';
import type { Props } from './interfaces/props.interface';
import { VisibilityPanelTemplate } from './visibility-panel.html';
import styles from './visibility-panel.module.css';

export const VisibilityPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  visibility,
  onChange,
  participants,
  currentUserId,
  listOwnerId,
  isOwner,
  isMobile = false,
  isChooseWhoEnabled,
  anchorRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const popoverMeasureRef = useRef<HTMLDivElement>(null);
  const fallbackAnchorRef = useRef<HTMLDivElement>(null);
  const resolvedAnchorRef = anchorRef ?? fallbackAnchorRef;

  useEffect(() => {
    if (!isOpen || isMobile) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        popoverMeasureRef.current?.contains(target)
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.(
        '[data-comment-visibility-anchor]'
      );
      if (anchor) {
        return;
      }

      onClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile, onClose]);

  if (!isOpen) {
    return null;
  }

  const onSelectMode = (mode: CommentVisibilityMode) => {
    if (mode === 'visibleToSelected' && !isChooseWhoEnabled) {
      return;
    }

    if (mode === 'visibleToSelected') {
      const seededIds = visibility.selectedUserIds.filter((id) => id !== currentUserId);
      onChange({
        mode,
        selectedUserIds: seededIds,
      });
      return;
    }
    onChange({ mode, selectedUserIds: [] });
  };

  const onToggleUser = (userId: string) => {
    const has = visibility.selectedUserIds.includes(userId);
    const nextIds = has
      ? visibility.selectedUserIds.filter((id) => id !== userId)
      : [...visibility.selectedUserIds, userId];
    onChange({ mode: 'visibleToSelected', selectedUserIds: nextIds });
  };

  const panelClassName = [styles.panel, isMobile ? styles['panel--sheet'] : styles['panel--dropdown']].join(' ');
  const isEveryoneActive = visibility.mode === 'visibleToAll';
  const isChooseWhoActive =
    visibility.mode === 'visibleToSelected' && isChooseWhoEnabled;
  const audienceRows = participants
    .filter((participant) => participant.userId !== currentUserId)
    .map((participant) => ({
      userId: participant.userId,
      name: participant.displayName || participant.username,
      roleLabel: resolveParticipantRoleLabel(participant, listOwnerId),
      checked: visibility.selectedUserIds.includes(participant.userId),
    }));

  const panel = (
    <VisibilityPanelTemplate
      isMobile = {
        isMobile
      }
      panelClassName = {
        panelClassName
      }
      isEveryoneActive = {
        isEveryoneActive
      }
      showSpoilerWarning = {
        !isOwner && isEveryoneActive
      }
      showHiddenFromOwner = {
        !isOwner
      }
      isHiddenFromOwnerActive = {
        visibility.mode === 'hiddenFromOwner'
      }
      isChooseWhoActive = {
        isChooseWhoActive
      }
      isChooseWhoEnabled = {
        isChooseWhoEnabled
      }
      chooseWhoDisabledHelp = {
        COMMENT_VISIBILITY_CHOOSE_WHO_DISABLED_HELP
      }
      audienceRows = {
        audienceRows
      }
      onSelectMode = {
        onSelectMode
      }
      onToggleUser = {
        onToggleUser
      }
      onDone = {
        onClose
      }
      panelRef = {
        panelRef
      }
    />
  );

  if (isMobile) {
    return ReactDOM.createPortal(panel, document.body);
  }

  return (
    <AnchoredPopover
      anchorRef = {
        resolvedAnchorRef
      }
      popoverRef={popoverMeasureRef}
      isOpen = {
        isOpen
      }
      estimatedHeight={
        isChooseWhoActive
          ? VISIBILITY_PANEL_POPOVER_ESTIMATED_HEIGHT_EXPANDED
          : VISIBILITY_PANEL_POPOVER_ESTIMATED_HEIGHT
      }
      estimatedWidth = {
        352
      }
    >
      {
        panel
      }
    </AnchoredPopover>
  );
};
