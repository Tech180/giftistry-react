import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { CommentVisibilityMode } from '../../../../interfaces/comment-visibility-mode.type';
import { AnchoredPopover } from '../toolbar/anchored-popover/anchored-popover.component';
import type { Props } from './interfaces/props.interface';
import { VisibilityPanelTemplate } from './visibility-panel.html';

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
  anchorRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const fallbackAnchorRef = useRef<HTMLDivElement>(null);
  const resolvedAnchorRef = anchorRef ?? fallbackAnchorRef;

  useEffect(() => {
    if (!isOpen || isMobile) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) {
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
    if (mode === 'visibleToSelected') {
      const seededIds =
        visibility.selectedUserIds.length > 0
          ? visibility.selectedUserIds
          : !isOwner && currentUserId
            ? [currentUserId]
            : [];
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

  const panel = (
    <VisibilityPanelTemplate
      isMobile = {
        isMobile
      }
      isOwner = {
        isOwner
      }
      mode = {
        visibility.mode
      }
      selectedUserIds = {
        visibility.selectedUserIds
      }
      participants = {
        participants
      }
      currentUserId = {
        currentUserId
      }
      listOwnerId = {
        listOwnerId
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
      popoverRef = {
        panelRef
      }
      isOpen = {
        isOpen
      }
      estimatedHeight = {
        360
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
