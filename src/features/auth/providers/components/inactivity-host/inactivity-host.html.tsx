import React from 'react';
import { InactivityModal } from '../../../components/inactivity-modal/inactivity-modal.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const InactivityHostTemplate: React.FC<TemplateProps> = ({
  isOpen,
  countdown,
  onExtendSession,
  onSignOut,
}) => {
  return (
    <InactivityModal
      isOpen = {
        isOpen
      }
      countdown = {
        countdown
      }
      onExtendSession = {
        onExtendSession
      }
      onSignOut = {
        onSignOut
      }
    />
  );
};
