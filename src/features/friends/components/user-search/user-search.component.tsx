import React, { useState, useEffect, useMemo } from 'react';
import { UserSearchProps } from './interfaces/user-search-props.interface';
import { UserSearchTemplate } from './user-search.html';
import { UserSearchResult } from '../../interfaces/friend.interface';

export const UserSearch: React.FC<UserSearchProps> = ({
  searchResults,
  isSearching,
  onSearch,
  onSendRequest,
  sendingId,
  existingFriendIds = [],
  pendingUserIds = [],
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const discoverableResults = useMemo(() => {
    const friendIds = new Set(existingFriendIds);
    return searchResults.filter((user) => !friendIds.has(user.Id));
  }, [searchResults, existingFriendIds]);

  const getDisplayName = (user: UserSearchResult) => {
    if (user.FirstName) return `${user.FirstName} ${user.LastName || ''}`.trim();
    return user.Username;
  };

  return (
    <UserSearchTemplate
      query={query}
      setQuery={setQuery}
      searchResults={discoverableResults}
      isSearching={isSearching}
      onSendRequest={onSendRequest}
      sendingId={sendingId}
      pendingUserIds={pendingUserIds}
      getDisplayName={getDisplayName}
    />
  );
};
