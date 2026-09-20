import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ShareModalTemplate } from './share-modal.html';

export const ShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  listId,
  isOwner,
}) => (
  <ShareModalTemplate
    isOpen = {
      isOpen
    }
    onClose = {
      onClose
    }
    listId = {
      listId
    }
    isOwner = {
      isOwner
    }
  />
);
