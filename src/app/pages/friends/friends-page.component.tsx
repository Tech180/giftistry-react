import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useFriendsController } from 'features/friends';
import { FriendsPageTemplate } from './friends-page.html';

type FriendsTab = 'current' | 'requests' | 'search';

function parseTab(value: string | null): FriendsTab | null {
  if (value === 'current' || value === 'requests' || value === 'search') {
    return value;
  }
  return null;
}

const getDaysUntil = (dateStr?: string | null) => {
  if (!dateStr) return 999;
  const now = new Date();
  const bday = new Date(dateStr);
  bday.setFullYear(now.getFullYear());
  if (bday < now && (now.getTime() - bday.getTime()) > 86400000) {
    bday.setFullYear(now.getFullYear() + 1);
  }
  const diff = Math.ceil((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff;
};

export default function FriendsPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
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
  } = useFriendsController();

  const parsedTab = parseTab(tab ?? null);

  // If the tab path parameter is invalid, redirect to /friends/current
  if (tab && !parsedTab) {
    return <Navigate to="/friends/current" replace />;
  }

  const activeTab = parsedTab ?? 'current';
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter, Sort and Modal States
  const [filterQuery, setFilterQuery] = useState('');
  const [sortMethod, setSortMethod] = useState<'name' | 'recent' | 'birthday'>('name');
  const [friendToRemove, setFriendToRemove] = useState<{ id: string; name: string } | null>(null);


  const highlightedRequestId = searchParams.get('highlightRequest');
  const highlightedUserId = searchParams.get('highlightUser');

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (!highlightedRequestId && !highlightedUserId) return;

    const timer = window.setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('highlightRequest');
        next.delete('highlightUser');
        return next;
      }, { replace: true });
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [highlightedRequestId, highlightedUserId, setSearchParams]);

  const setActiveTab = useCallback((nextTab: FriendsTab) => {
    const next = new URLSearchParams(searchParams);
    next.delete('highlightRequest');
    next.delete('highlightUser');
    const searchStr = next.toString();
    navigate(`/friends/${nextTab}${searchStr ? `?${searchStr}` : ''}`, { replace: true });
  }, [navigate, searchParams]);

  const friendsWithRealData = useMemo(() => {
    return friends.map((f) => {
      return {
        ...f,
        DaysUntilBirthday: f.Birthday ? getDaysUntil(f.Birthday) : 999,
      };
    });
  }, [friends]);

  const filteredFriends = useMemo(() => {
    return friendsWithRealData.filter((f) => {
      const name = `${f.FirstName || ''} ${f.LastName || ''}`.toLowerCase();
      const username = (f.Username || '').toLowerCase();
      const q = filterQuery.toLowerCase().trim();
      return name.includes(q) || username.includes(q);
    });
  }, [friendsWithRealData, filterQuery]);

  const sortedFriends = useMemo(() => {
    const list = [...filteredFriends];
    if (sortMethod === 'name') {
      list.sort((a, b) => {
        const nameA = `${a.FirstName || ''} ${a.LastName || ''}`.trim();
        const nameB = `${b.FirstName || ''} ${b.LastName || ''}`.trim();
        return nameA.localeCompare(nameB);
      });
    } else if (sortMethod === 'recent') {
      list.sort((a, b) => {
        const dateA = a.FriendsSince ? new Date(a.FriendsSince).getTime() : 0;
        const dateB = b.FriendsSince ? new Date(b.FriendsSince).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortMethod === 'birthday') {
      list.sort((a, b) => (a.DaysUntilBirthday ?? 999) - (b.DaysUntilBirthday ?? 999));
    }
    return list;
  }, [filteredFriends, sortMethod]);

  const existingFriendIds = useMemo(() => friends.map((friend) => friend.UserId), [friends]);

  const pendingUserIds = useMemo(() => {
    return [
      ...incomingRequests.map((r) => r.SenderId),
      ...outgoingRequests.map((r) => r.ReceiverId),
    ];
  }, [incomingRequests, outgoingRequests]);

  const handleSendRequest = async (userId: string) => {
    setProcessingId(userId);
    try {
      await sendRequest(userId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await acceptRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await rejectRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveFriend = async (friendUserId: string) => {
    setProcessingId(friendUserId);
    try {
      await removeFriend(friendUserId);
      setFriendToRemove(null);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <FriendsPageTemplate
      friends={sortedFriends}
      incomingRequests={incomingRequests}
      outgoingRequests={outgoingRequests}
      searchResults={searchResults}
      isLoading={isLoading}
      isSearching={isSearching}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onSearch={searchUsers}
      onSendRequest={handleSendRequest}
      onAcceptRequest={handleAcceptRequest}
      onRejectRequest={handleRejectRequest}
      onRemoveFriend={handleRemoveFriend}
      processingId={processingId}
      existingFriendIds={existingFriendIds}
      pendingUserIds={pendingUserIds}
      highlightedRequestId={highlightedRequestId}
      highlightedUserId={highlightedUserId}
      totalFriendsCount={friends.length}
      filterQuery={filterQuery}
      setFilterQuery={setFilterQuery}
      sortMethod={sortMethod}
      setSortMethod={setSortMethod}
      friendToRemove={friendToRemove}
      setFriendToRemove={setFriendToRemove}
    />
  );
}
