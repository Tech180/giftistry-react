import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { notificationsApi } from 'features/notifications';
import { Button, LoadingState, ErrorState, EnterPanel } from 'shared/ui';
import styles from './invite-accept-page.module.css';

interface InviteDetails {
  ListId: string;
  Role: string;
  PasswordProtected: boolean;
  ExpiresAt: string | null;
}

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [listId, setListId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid invite link.');
      setIsLoading(false);
      return;
    }

    const loadDetails = async () => {
      try {
        const details = await notificationsApi.getInviteLinkDetails(token);
        setInviteDetails(details);
        
        if (!details.PasswordProtected) {
          // Auto-accept if not password protected
          const result = await notificationsApi.acceptListInvite(token);
          if (result.ListId) {
            setListId(result.ListId);
          }
          setIsSuccess(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to retrieve invite details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [token]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setInviteError(null);

    try {
      const result = await notificationsApi.acceptListInvite(token, password);
      if (result.ListId) {
        setListId(result.ListId);
      }
      setIsSuccess(true);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to accept invite.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Checking invite link..." fullHeight />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message={error} />
        <Link to="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
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
              <Button variant="primary" onClick={() => navigate(`/wishlists/${listId}`)}>
                View Wishlist
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
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
              {isSubmitting ? 'Accepting...' : 'Accept Invite'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </EnterPanel>
  );
}
