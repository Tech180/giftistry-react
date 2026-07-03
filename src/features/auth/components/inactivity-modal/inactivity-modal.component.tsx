import React from 'react';
import { InactivityModalProps } from './interfaces/inactivity-modal-props.interface';
import { InactivityModalTemplate } from './inactivity-modal.html';

export const InactivityModal: React.FC<InactivityModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <InactivityModalTemplate {...props} />;
};
