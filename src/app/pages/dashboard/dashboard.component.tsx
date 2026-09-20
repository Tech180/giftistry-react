import React from 'react';
import { useRegisterActions } from 'app/providers/mobile-page-actions';
import { ItemsSessionProvider } from 'features/items';
import { WishlistSessionProvider } from 'features/wishlists';
import { useDashboard } from './hooks/use-dashboard';
import { DashboardTemplate } from './dashboard.html';

export default function Dashboard() {
  const { pageActions, ...templateProps } = useDashboard();

  useRegisterActions(pageActions);

  return (
    <ItemsSessionProvider>
      <WishlistSessionProvider>
        <DashboardTemplate
          {...templateProps}
        />
      </WishlistSessionProvider>
    </ItemsSessionProvider>
  );
}
