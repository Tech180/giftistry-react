import React from 'react';
import { useAuth } from 'features/auth';
import { useMobilePageActions } from '../../context';
import { PAGE_ACTIONS_ARIA_LABEL } from './constants/copy.constant';
import { HostTemplate } from './host.html';

export const Host: React.FC = () => {
  const { user } = useAuth();
  const { pageActions } = useMobilePageActions();

  if (!user || pageActions.length === 0) {
    return null;
  }

  return (
    <HostTemplate
      pageActions = {
        pageActions
      }
      ariaLabel = {
        PAGE_ACTIONS_ARIA_LABEL
      }
    />
  );
};
