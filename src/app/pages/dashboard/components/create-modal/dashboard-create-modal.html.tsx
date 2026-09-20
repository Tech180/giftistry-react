import React from 'react';
import { CreateListForm } from 'features/wishlists';
import { Modal } from 'shared/ui';
import type { DashboardCreateModalTemplateProps } from './interfaces/dashboard-create-modal-template-props.interface';

export const DashboardCreateModalTemplate: React.FC<DashboardCreateModalTemplateProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Create new wishlist"
    subtitle="Configure details and advanced settings."
  >
    <CreateListForm onSuccess={onSuccess} onCancel={onClose} />
  </Modal>
);
