import React from 'react';
import { Link } from 'react-router-dom';
import { Button, LoadingState, ErrorState, EnterPanel } from 'shared/ui';
import { GuestWishlistPreview } from './components/guest-wishlist-preview/guest-wishlist-preview.component';
import { InviteAcceptPageTemplateProps } from './interfaces/invite-accept-page-template-props.interface';
import styles from './invite-accept-page.module.css';

export const InviteAcceptPageTemplate: React.FC<InviteAcceptPageTemplateProps> = ({
  isLoading,
  error,
  inviteError,
  password,
  setPassword,
  isSubmitting,
  isSuccess,
  listId,
  isAuthenticated,
  guestPreview,
  handleSubmit,
  handleViewWishlist,
  handleGoDashboard,
}) => {
  if (isLoading) {
    return <LoadingState message="Checking invite link..." fullHeight />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message={error} />
        <Link to={isAuthenticated ? '/dashboard' : '/login'}>
          <Button variant="secondary">{isAuthenticated ? 'Back to Dashboard' : 'Log in'}</Button>
        </Link>
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
      <EnterPanel animation="fade" className={styles.container}>
        <div className={styles['success-card']}>
          <h1 className={styles.title}>Invite Accepted!</h1>
          <p className={styles.message}>You now have access to this wishlist.</p>
          <div className={styles.actions}>
            {listId && (
              <Button variant="primary" onClick={handleViewWishlist}>
                View Wishlist
              </Button>
            )}
            <Button variant="secondary" onClick={handleGoDashboard}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </EnterPanel>
    );
  }

  return (
    <EnterPanel animation="fade" className={styles.container}>
      <div className={styles['success-card']}>
        <h1 className={styles.title}>Password Required</h1>
        <p className={styles.message}>This wishlist share link is password-protected.</p>

        <form onSubmit={handleSubmit} className={styles['password-form']}>
          <div className={styles['input-group']}>
            <label htmlFor="invite-password" className={styles.label}>
              Enter Link Password
            </label>
            <input
              id="invite-password"
              type="password"
              className={styles['password-input']}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              required
            />
            {inviteError && <div className={styles['error-message']}>{inviteError}</div>}
          </div>
          <div className={styles.actions}>
            <Button type="submit" variant="primary" disabled={isSubmitting || !password}>
              {isSubmitting
                ? 'Opening...'
                : isAuthenticated
                  ? 'Accept Invite'
                  : 'View Wishlist'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGoDashboard}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </EnterPanel>
  );
};
