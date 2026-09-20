import React, { useEffect, useRef, useState } from 'react';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { SEARCH_DEBOUNCE_MS } from '../../constants/search-debounce-ms.constant';
import type { Props } from './interfaces/props.interface';
import { UserSearchTemplate } from './user-search.html';

export const UserSearch: React.FC<Props> = ({
  searchResults,
  isSearching,
  onSearch,
  onSendRequest,
  sendingId,
  existingFriendIds = [],
  pendingUserIds = [],
}) => {
  const [query, setQuery] = useState('');
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchRef.current(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const friendIds = new Set(existingFriendIds);
  const discoverableResults = searchResults.filter((user) => !friendIds.has(user.Id));

  return (
    <UserSearchTemplate
      query = {
        query
      }
      setQuery = {
        setQuery
      }
      searchResults = {
        discoverableResults
      }
      isSearching = {
        isSearching
      }
      onSendRequest = {
        onSendRequest
      }
      sendingId = {
        sendingId
      }
      pendingUserIds = {
        pendingUserIds
      }
      getDisplayName = {
        getDisplayName
      }
    />
  );
};
