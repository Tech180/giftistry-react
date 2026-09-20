import React from 'react';
import { Modal } from 'shared/ui';
import { SharePanel } from 'features/wishlists';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ShareModalTemplate: React.FC<TemplateProps> = ({
  isOpen,
  onClose,
  listId,
  isOwner,
}) => (
  <Modal
    isOpen = {
      isOpen
    }
    onClose = {
      onClose
    }
    title = {
      'Share Wishlist'
    }
  >
    <SharePanel
      listId = {
        listId
      }
      isOwner = {
        isOwner
      }
    />
  </Modal>
);
