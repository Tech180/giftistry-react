import React from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './request-list.module.css';

export const RequestListTemplate: React.FC<TemplateProps> = ({
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
    return <p className={styles['request-list__empty']}>No pending friend requests.</p>;
  }

  return (
    <div className={styles['request-list']}>
      {incoming.length > 0 ? (
        <section className={styles['request-list__section']}>
          <h4 className={styles['request-list__section-title']}>Incoming Requests</h4>
          <ul className={styles['request-list__items']}>
            {incoming.map((request) => {
              const displayName = getDisplayName(request, 'incoming');
              const userId = getUserId(request, 'incoming');
              const username = request.SenderUsername || 'user';
              const initials = displayName.slice(0, 2).toUpperCase();
              const isHighlighted = highlightedRequestId === request.Id;

              return (
                <li
                  key={request.Id}
                  id={`friend-request-${request.Id}`}
                  className={[
                    styles['request-list__item'],
                    isHighlighted ? styles['request-list__item--highlighted'] : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className={styles['request-list__user']}>
                    <UserAvatar
                      avatar = {
                        request.SenderAvatar
                      }
                      alt = {
                        displayName
                      }
                      initials = {
                        initials
                      }
                      className = {
                        styles['request-list__avatar']
                      }
                      imageClassName = {
                        styles['request-list__avatar-img']
                      }
                      initialsClassName = {
                        styles['request-list__avatar-initials']
                      }
                    />
                    <div className={styles['request-list__name-meta']}>
                      <UserPreviewCard
                        userId = {
                          userId
                        }
                        displayName = {
                          displayName
                        }
                        fallbackUser = {
                          {
                            Username: request.SenderUsername,
                            FirstName: request.SenderFirstName,
                            LastName: request.SenderLastName,
                            Avatar: request.SenderAvatar,
                          }
                        }
                      >
                        <span className={styles['request-list__user-name']}>{displayName}</span>
                      </UserPreviewCard>
                      <span className={styles['request-list__username']}>@{username}</span>
                    </div>
                  </div>

                  <div className={styles['request-list__actions']}>
                    <button
                      type="button"
                      className={[
                        styles['request-list__action'],
                        styles['request-list__action--accept'],
                      ].join(' ')}
                      onClick={() => onAccept(request.Id)}
                      disabled={processingId === request.Id}
                      title="Accept"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      className={[
                        styles['request-list__action'],
                        styles['request-list__action--reject'],
                      ].join(' ')}
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
      ) : null}

      {outgoing.length > 0 ? (
        <section className={styles['request-list__section']}>
          <h4 className={styles['request-list__section-title']}>Sent Requests</h4>
          <ul className={styles['request-list__items']}>
            {outgoing.map((request) => {
              const displayName = getDisplayName(request, 'outgoing');
              const userId = getUserId(request, 'outgoing');
              const username = request.ReceiverUsername || 'user';
              const initials = displayName.slice(0, 2).toUpperCase();
              const isHighlighted = highlightedRequestId === request.Id;

              return (
                <li
                  key={request.Id}
                  id={`friend-request-${request.Id}`}
                  className={[
                    styles['request-list__item'],
                    isHighlighted ? styles['request-list__item--highlighted'] : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className={styles['request-list__user']}>
                    <UserAvatar
                      avatar = {
                        request.ReceiverAvatar
                      }
                      alt = {
                        displayName
                      }
                      initials = {
                        initials
                      }
                      className = {
                        styles['request-list__avatar']
                      }
                      imageClassName = {
                        styles['request-list__avatar-img']
                      }
                      initialsClassName = {
                        styles['request-list__avatar-initials']
                      }
                    />
                    <div className={styles['request-list__name-meta']}>
                      <UserPreviewCard
                        userId = {
                          userId
                        }
                        displayName = {
                          displayName
                        }
                        fallbackUser = {
                          {
                            Username: request.ReceiverUsername,
                            FirstName: request.ReceiverFirstName,
                            LastName: request.ReceiverLastName,
                            Avatar: request.ReceiverAvatar,
                          }
                        }
                      >
                        <span className={styles['request-list__user-name']}>{displayName}</span>
                      </UserPreviewCard>
                      <span className={styles['request-list__username']}>@{username}</span>
                    </div>
                  </div>
                  <Badge size="sm">Pending</Badge>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
};
