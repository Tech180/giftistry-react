import React from 'react';
import { Listener } from './components/listener/listener.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ToastHostTemplate: React.FC<TemplateProps> = ({ showListener }) => {
  if (!showListener) {
    return null;
  }

  return <Listener />;
};
