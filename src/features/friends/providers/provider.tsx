import React, { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from 'features/auth';
import { friendsApi } from '../api/friends.api';
import type { Friend } from '../interfaces/friend.interface';
import type { FriendRequest } from '../interfaces/friend-request.interface';
import type { UserSearchResult } from '../interfaces/user-search-result.interface';
import { FriendsContext } from './context';

export function FriendsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    setFriends([]);
    setIncomingRequests([]);
    setOutgoingRequests([]);
    setSearchResults([]);
    setIsLoading(false);
    setIsSearching(false);
    setError(null);
  }, [isAuthenticated]);

  const fetchFriends = async () => {
    if (!isAuthenticated) {
      setFriends([]);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setSearchResults([]);
      setIsLoading(false);
      setIsSearching(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [friendsList, requests] = await Promise.all([
        friendsApi.listFriends(),
        friendsApi.listFriendRequests(),
      ]);
      setFriends(friendsList || []);
      setIncomingRequests(requests?.Incoming || []);
      setOutgoingRequests(requests?.Outgoing || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load friends.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await friendsApi.searchUsers(query.trim());
      setSearchResults(results || []);
    } catch (err) {
      setSearchResults([]);
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  const sendRequest = async (userId: string) => {
    await friendsApi.sendRequest(userId);
    await fetchFriends();
  };

  const acceptRequest = async (requestId: string) => {
    await friendsApi.acceptRequest(requestId);
    await fetchFriends();
  };

  const rejectRequest = async (requestId: string) => {
    await friendsApi.rejectRequest(requestId);
    await fetchFriends();
  };

  const removeFriend = async (friendId: string) => {
    await friendsApi.removeFriend(friendId);
    await fetchFriends();
  };

  return (
    <FriendsContext.Provider
      value = {
        {
          friends,
          incomingRequests,
          outgoingRequests,
          searchResults,
          isLoading,
          isSearching,
          error,
          fetchFriends,
          searchUsers,
          sendRequest,
          acceptRequest,
          rejectRequest,
          removeFriend,
        }
      }
    >
      {children}
    </FriendsContext.Provider>
  );
}
