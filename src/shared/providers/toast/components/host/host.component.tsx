import React from 'react';
import type { Props } from './interfaces/props.interface';
import { HostTemplate } from './host.html';

export const Host: React.FC<Props> = (props) => {
  return (
    <HostTemplate
      toasts = {
        props.toasts
      }
      onDismiss = {
        props.onDismiss
      }
    />
  );
};
