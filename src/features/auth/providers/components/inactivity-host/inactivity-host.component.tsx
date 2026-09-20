import React from 'react';
import type { Props } from './interfaces/props.interface';
import { InactivityHostTemplate } from './inactivity-host.html';

export const InactivityHost: React.FC<Props> = (props) => {
  return (
    <InactivityHostTemplate
      isOpen = {
        props.isOpen
      }
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
