import React from 'react';
import { usePage } from './hooks/use-page';
import { PageTemplate } from './page.html';

export default function UserProfile() {
  const templateProps = usePage();

  return (
    <PageTemplate
      user = {
        templateProps.user
      }
      isLoading = {
        templateProps.isLoading
      }
      error = {
        templateProps.error
      }
      isDisabled = {
        templateProps.isDisabled
      }
      displayName = {
        templateProps.displayName
      }
      userInitials = {
        templateProps.userInitials
      }
      joinedLabel = {
        templateProps.joinedLabel
      }
      statusText = {
        templateProps.statusText
      }
      isOnline = {
        templateProps.isOnline
      }
      onBack = {
        templateProps.onBack
      }
      onTryTheme = {
        templateProps.onTryTheme
      }
    />
  );
}
