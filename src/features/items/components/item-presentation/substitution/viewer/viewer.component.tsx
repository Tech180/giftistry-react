import React from 'react';
import { Modal } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import { ViewerTemplate } from './viewer.html';

export const Viewer: React.FC<Props> = ({
  isOpen,
  onClose,
  option,
}) => {
  if (!option) {
    return null;
  }

  const links = (option.Item.Links ?? []).map((link) => ({
    id: link.Id,
    href: link.Url,
    label: link.RetailerName || link.Url,
  }));

  return (
    <Modal
      isOpen = {
        isOpen
      }
      onClose = {
        onClose
      }
      title = {
        'Substitution'
      }
    >
      <ViewerTemplate
        kind = {
          option.Kind
        }
        createdByUserId = {
          option.CreatedByUserId
        }
        name = {
          option.Item.Name
        }
        description = {
          option.Item.Description
        }
        links = {
          links
        }
      />
    </Modal>
  );
};
