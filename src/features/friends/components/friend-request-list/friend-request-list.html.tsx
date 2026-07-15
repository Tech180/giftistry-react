import React from 'react';
import { Check, X } from 'lucide-react';
import { UserPreviewCard, Badge } from 'shared/ui';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { FriendRequestListTemplateProps } from './interfaces/friend-request-list-template-props.interface';
import styles from './friend-request-list.module.css';

export const FriendRequestListTemplate: React.FC<FriendRequestListTemplateProps> = ({
  incoming,
  outgoing,
  onAccept,
  onReject,
  processingId,
  highlightedRequestId,
  getDisplayName,
  getUserId,
}) => {
  if (incoming.length === 0 && outgoing.length === 0) {
    return <p className={styles['empty-text']}>No pending friend requests.</p>;
  }

  return (
    <div className={styles.container}>
      {incoming.length > 0 && (
        <section className={styles.section}>
          <h4 className={styles['section-title']}>Incoming Requests</h4>
          <ul className={styles.list}>
            {incoming.map((request) => {
              const displayName = getDisplayName(request, 'incoming');
              const userId = getUserId(request, 'incoming');
              const username = request.SenderUsername || 'user';
              const initials = (displayName.slice(0, 2)).toUpperCase();

              return (
                <li
                  key={request.Id}
                  id={`friend-request-${request.Id}`}
                  className={`${styles['list-item']} ${highlightedRequestId === request.Id ? styles['list-item-highlighted'] : ''}`}
                >
                  <div className={styles['user-group']}>
                    <UserAvatar
                      avatar={request.SenderAvatar}
                      alt={displayName}
                      initials={initials}
                      className={styles.avatar}
                      imageClassName={styles['avatar-img']}
                      initialsClassName={styles['avatar-initials']}
                    />
                    <div className={styles['name-meta']}>
                      <UserPreviewCard
                        userId={userId}
                        displayName={displayName}
                        fallbackUser={{
                          Username: request.SenderUsername,
                          FirstName: request.SenderFirstName,
                          LastName: request.SenderLastName,
                          Avatar: request.SenderAvatar,
                        }}
                      >
                        <span className={styles['user-name']}>{displayName}</span>
                      </UserPreviewCard>
                      <span className={styles.username}>@{username}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles['action-btn']} ${styles['accept-btn']}`}
                      onClick={() => onAccept(request.Id)}
                      disabled={processingId === request.Id}
                      title="Accept"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      className={`${styles['action-btn']} ${styles['reject-btn']}`}
                      onClick={() => onReject(request.Id)}
                      disabled={processingId === request.Id}
                      title="Reject"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {outgoing.length > 0 && (
        <section className={styles.section}>
          <h4 className={styles['section-title']}>Sent Requests</h4>
          <ul className={styles.list}>
            {outgoing.map((request) => {
              const displayName = getDisplayName(request, 'outgoing');
              const userId = getUserId(request, 'outgoing');
              const username = request.ReceiverUsername || 'user';
              const initials = (displayName.slice(0, 2)).toUpperCase();

              return (
                <li
                  key={request.Id}
                  id={`friend-request-${request.Id}`}
                  className={`${styles['list-item']} ${highlightedRequestId === request.Id ? styles['list-item-highlighted'] : ''}`}
                >
                  <div className={styles['user-group']}>
                    <UserAvatar
                      avatar={request.ReceiverAvatar}
                      alt={displayName}
                      initials={initials}
                      className={styles.avatar}
                      imageClassName={styles['avatar-img']}
                      initialsClassName={styles['avatar-initials']}
                    />
                    <div className={styles['name-meta']}>
                      <UserPreviewCard
                        userId={userId}
                        displayName={displayName}
                        fallbackUser={{
                          Username: request.ReceiverUsername,
                          FirstName: request.ReceiverFirstName,
                          LastName: request.ReceiverLastName,
                          Avatar: request.ReceiverAvatar,
                        }}
                      >
                        <span className={styles['user-name']}>{displayName}</span>
                      </UserPreviewCard>
                      <span className={styles.username}>@{username}</span>
                    </div>
                  </div>
                  <Badge size="sm">Pending</Badge>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};
