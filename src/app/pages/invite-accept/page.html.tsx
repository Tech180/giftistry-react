import React from 'react';
import { EnterPanel, LoadingState } from 'shared/ui';
import { GuestWishlistPreview } from './components/guest-wishlist-preview/guest-wishlist-preview.component';
import { ErrorView } from './components/error-view/error-view.component';
import { Success } from './components/success/success.component';
import { PasswordForm } from './components/password-form/password-form.component';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = ({
  isLoading,
  error,
  inviteError,
  password,
  isSubmitting,
  isSuccess,
  listId,
  isAuthenticated,
  guestPreview,
  homeLabel,
  onPasswordChange,
  onSubmit,
  onViewWishlist,
  onGoHome,
}) => {
  if (isLoading) {
    return <LoadingState message="Checking invite link..." fullHeight />;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorView message={error} homeLabel={homeLabel} onGoHome={onGoHome} />
      </div>
    );
  }

  if (guestPreview) {
    return (
      <GuestWishlistPreview
        wishlist={guestPreview.Wishlist}
        items={guestPreview.Items}
        groups={guestPreview.Groups}
      />
    );
  }

  if (isSuccess) {
    return (
      <EnterPanel animation="fade" className={styles.page}>
        <Success listId={listId} onViewWishlist={onViewWishlist} onGoHome={onGoHome} />
      </EnterPanel>
    );
  }

  return (
    <EnterPanel animation="fade" className={styles.page}>
      <PasswordForm
        password={password}
        inviteError={inviteError}
        isSubmitting={isSubmitting}
        isAuthenticated={isAuthenticated}
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
        onCancel={onGoHome}
      />
    </EnterPanel>
  );
};
