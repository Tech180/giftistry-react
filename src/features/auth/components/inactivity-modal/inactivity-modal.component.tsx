import React from 'react';
import type { Props } from './interfaces/props.interface';
import { InactivityModalTemplate } from './inactivity-modal.html';

export const InactivityModal: React.FC<Props> = (props) => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <InactivityModalTemplate
      countdown = {
        props.countdown
      }
      onExtendSession = {
        props.onExtendSession
      }
      onSignOut = {
        props.onSignOut
      }
    />
  );
};
