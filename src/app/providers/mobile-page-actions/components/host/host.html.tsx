import React from 'react';
import { FloatingActionMenu } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const HostTemplate: React.FC<TemplateProps> = ({
  pageActions,
  ariaLabel,
  closedTourTarget,
}) => {
  return (
    <FloatingActionMenu
      actions = {
        pageActions
      }
      ariaLabel = {
        ariaLabel
      }
      closedTourTarget = {
        closedTourTarget
      }
    />
  );
};
