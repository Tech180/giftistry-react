import React, { useEffect } from 'react';
import { FriendRequestListProps } from './interfaces/friend-request-list-props.interface';
import { FriendRequestListTemplate } from './friend-request-list.html';
import { FriendRequest } from '../../interfaces/friend.interface';

export const FriendRequestList: React.FC<FriendRequestListProps> = ({
  highlightedRequestId,
  ...props
}) => {
  useEffect(() => {
    if (!highlightedRequestId) return;

    const element = document.getElementById(`friend-request-${highlightedRequestId}`);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedRequestId, props.incoming, props.outgoing]);

  const getDisplayName = (request: FriendRequest, type: 'incoming' | 'outgoing') => {
    if (type === 'incoming') {
      if (request.SenderFirstName) {
        return `${request.SenderFirstName} ${request.SenderLastName || ''}`.trim();
      }
      return request.SenderUsername || 'Unknown User';
    }

    if (request.ReceiverFirstName) {
      return `${request.ReceiverFirstName} ${request.ReceiverLastName || ''}`.trim();
    }
    return request.ReceiverUsername || 'Unknown User';
  };

  const getUserId = (request: FriendRequest, type: 'incoming' | 'outgoing') => {
    return type === 'incoming' ? request.SenderId : request.ReceiverId;
  };

  return (
    <FriendRequestListTemplate
      {...props}
      highlightedRequestId={highlightedRequestId}
      getDisplayName={getDisplayName}
      getUserId={getUserId}
    />
  );
};
