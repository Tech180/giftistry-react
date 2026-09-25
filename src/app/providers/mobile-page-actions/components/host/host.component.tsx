import React from 'react';
import { useAuth } from 'features/auth';
import { TOUR_TARGETS } from 'features/tour';
import { useMobilePageActions } from '../../context';
import { PAGE_ACTIONS_ARIA_LABEL } from './constants/copy.constant';
import { HostTemplate } from './host.html';

export const Host: React.FC = () => {
  const { user } = useAuth();
  const { pageActions } = useMobilePageActions();

  if (!user || pageActions.length === 0) {
    return null;
  }

  const closedTourTarget = pageActions.some((action) => action.id === 'create')
    ? TOUR_TARGETS.createWishlistFab
    : undefined;

  return (
    <HostTemplate
      pageActions = {
        pageActions
      }
      ariaLabel = {
        PAGE_ACTIONS_ARIA_LABEL
      }
      closedTourTarget = {
        closedTourTarget
      }
    />
  );
};
