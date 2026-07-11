import { useState, useCallback } from 'react';
import { friendsApi } from '../api/friends.api';
import { Friend, FriendRequest, UserSearchResult } from '../interfaces/friend.interface';

export const useFriendsController = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
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
  }, []);

  const searchUsers = useCallback(async (query: string) => {
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
  }, []);

  const sendRequest = useCallback(async (userId: string) => {
    await friendsApi.sendRequest(userId);
    await fetchFriends();
  }, [fetchFriends]);

  const acceptRequest = useCallback(async (requestId: string) => {
    await friendsApi.acceptRequest(requestId);
    await fetchFriends();
  }, [fetchFriends]);

  const rejectRequest = useCallback(async (requestId: string) => {
    await friendsApi.rejectRequest(requestId);
    await fetchFriends();
  }, [fetchFriends]);

  const removeFriend = useCallback(async (friendId: string) => {
    await friendsApi.removeFriend(friendId);
    await fetchFriends();
  }, [fetchFriends]);

  return {
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
  };
};
