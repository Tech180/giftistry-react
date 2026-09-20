import React from 'react';
import { LoadingState } from 'shared/ui';
import { FriendList, FriendRequestList, UserSearch } from 'features/friends';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './content.module.css';

export const ContentTemplate: React.FC<TemplateProps> = ({
  activeTab,
  friends,
  incomingRequests,
  outgoingRequests,
  searchResults,
  isLoading,
  isSearching,
  processingId,
  existingFriendIds,
  pendingUserIds,
  highlightedRequestId,
  highlightedUserId,
  onSearch,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onRequestRemoveFriend,
}) => (
  <div className={styles['content']}>
    {isLoading ? (
      <LoadingState message="Loading friends..." />
    ) : (
      <>
        {activeTab === 'current' ? (
          <FriendList
            friends = {
              friends
            }
            onRemove = {
              onRequestRemoveFriend
            }
            removingId = {
              processingId
            }
            highlightedUserId = {
              highlightedUserId
            }
          />
        ) : null}
        {activeTab === 'requests' ? (
          <FriendRequestList
            incoming = {
              incomingRequests
            }
            outgoing = {
              outgoingRequests
            }
            onAccept = {
              onAcceptRequest
            }
            onReject = {
              onRejectRequest
            }
            processingId = {
              processingId
            }
            highlightedRequestId = {
              highlightedRequestId
            }
          />
        ) : null}
        {activeTab === 'search' ? (
          <UserSearch
            searchResults = {
              searchResults
            }
            isSearching = {
              isSearching
            }
            onSearch = {
              onSearch
            }
            onSendRequest = {
              onSendRequest
            }
            sendingId = {
              processingId
            }
            existingFriendIds = {
              existingFriendIds
            }
            pendingUserIds = {
              pendingUserIds
            }
          />
        ) : null}
      </>
    )}
  </div>
);
