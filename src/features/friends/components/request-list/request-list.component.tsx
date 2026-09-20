import React, { useEffect } from 'react';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import type { FriendRequest } from '../../interfaces/friend-request.interface';
import type { Props } from './interfaces/props.interface';
import { RequestListTemplate } from './request-list.html';

export const RequestList: React.FC<Props> = ({
  highlightedRequestId,
  ...props
}) => {
  useEffect(() => {
    if (!highlightedRequestId) {
      return;
    }

    const element = document.getElementById(`friend-request-${highlightedRequestId}`);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedRequestId, props.incoming, props.outgoing]);

  const getRequestDisplayName = (request: FriendRequest, type: 'incoming' | 'outgoing') => {
    if (type === 'incoming') {
      return getDisplayName({
        FirstName: request.SenderFirstName,
        LastName: request.SenderLastName,
        Username: request.SenderUsername,
      });
    }

    return getDisplayName({
      FirstName: request.ReceiverFirstName,
      LastName: request.ReceiverLastName,
      Username: request.ReceiverUsername,
    });
  };

  const getUserId = (request: FriendRequest, type: 'incoming' | 'outgoing') => {
    return type === 'incoming' ? request.SenderId : request.ReceiverId;
  };

  return (
    <RequestListTemplate
      {...props}
      highlightedRequestId = {
        highlightedRequestId
      }
      getDisplayName = {
        getRequestDisplayName
      }
      getUserId = {
        getUserId
      }
    />
  );
};
