import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePage } from './hooks/use-page';
import { PageTemplate } from './page.html';

export default function FriendsPage() {
  const { redirectTo, ...templateProps } = usePage();

  if (redirectTo) {
    return (
      <Navigate
        to = {
          redirectTo
        }
        replace = {
          true
        }
      />
    );
  }

  return <PageTemplate {...templateProps} />;
}
