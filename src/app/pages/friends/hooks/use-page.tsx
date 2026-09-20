import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFriendsController } from 'features/friends';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { DEFAULT_PATH, DEFAULT_TAB } from '../constants/default-tab.constant';
import { HIGHLIGHT_MS } from '../constants/highlight-ms.constant';
import { SORT_OPTIONS } from '../constants/sort-options.constant';
import { TABS } from '../constants/tabs.constant';
import type { RemoveTarget } from '../interfaces/remove-target.interface';
import type { SortMethod } from '../interfaces/sort-method.type';
import type { TabId } from '../interfaces/tab-id.type';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { enrichWithBirthday } from '../utils/enrich-with-birthday.util';
import { filterByQuery } from '../utils/filter-by-query.util';
import { parseTab } from '../utils/parse-tab.util';
import { sortByMethod } from '../utils/sort.util';

export function usePage(): UsePageResult {
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
  const redirectTo = tab && !parsedTab ? DEFAULT_PATH : null;
  const activeTab = parsedTab ?? DEFAULT_TAB;

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortMethod, setSortMethod] = useState<SortMethod>('name');
  const [friendToRemove, setFriendToRemove] = useState<RemoveTarget | null>(null);

  const highlightedRequestId = searchParams.get('highlightRequest');
  const highlightedUserId = searchParams.get('highlightUser');

  useEffect(() => {
    void fetchFriends();
    // Mount-only: fetchFriends only uses setState + API (unstable identity without useCallback).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, []);

  useEffect(() => {
    if (!highlightedRequestId && !highlightedUserId) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('highlightRequest');
        next.delete('highlightUser');
        return next;
      }, { replace: true });
    }, HIGHLIGHT_MS);

    return () => window.clearTimeout(timer);
  }, [highlightedRequestId, highlightedUserId, setSearchParams]);

  const onTabChange = (nextTab: TabId) => {
    const next = new URLSearchParams(searchParams);
    next.delete('highlightRequest');
    next.delete('highlightUser');
    const searchStr = next.toString();
    navigate(`/friends/${nextTab}${searchStr ? `?${searchStr}` : ''}`, { replace: true });
  };

  const enriched = enrichWithBirthday(friends);
  const filtered = filterByQuery(enriched, filterQuery);
  const sortedFriends = sortByMethod(filtered, sortMethod);
  const existingFriendIds = friends.map((friend) => friend.UserId);
  const pendingUserIds = [
    ...incomingRequests.map((r) => r.SenderId),
    ...outgoingRequests.map((r) => r.ReceiverId),
  ];

  const onSendRequest = async (userId: string) => {
    setProcessingId(userId);
    try {
      await sendRequest(userId);
    } finally {
      setProcessingId(null);
    }
  };

  const onAcceptRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await acceptRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const onRejectRequest = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await rejectRequest(requestId);
    } finally {
      setProcessingId(null);
    }
  };

  const onRequestRemoveFriend = (friendId: string) => {
    const friend = friends.find((f) => f.UserId === friendId);
    if (!friend) {
      return;
    }

    setFriendToRemove({ id: friendId, name: getDisplayName(friend) });
  };

  const onConfirmRemoveFriend = async () => {
    if (!friendToRemove) {
      return;
    }

    setProcessingId(friendToRemove.id);
    try {
      await removeFriend(friendToRemove.id);
      setFriendToRemove(null);
    } finally {
      setProcessingId(null);
    }
  };

  const onCloseRemoveModal = () => {
    if (friendToRemove && processingId === friendToRemove.id) {
      return;
    }

    setFriendToRemove(null);
  };

  return {
    redirectTo,
    friends: sortedFriends,
    incomingRequests,
    outgoingRequests,
    searchResults,
    isLoading,
    isSearching,
    error,
    activeTab,
    tabs: TABS,
    sortOptions: SORT_OPTIONS,
    onTabChange,
    onSearch: searchUsers,
    onSendRequest,
    onAcceptRequest,
    onRejectRequest,
    onRequestRemoveFriend,
    onConfirmRemoveFriend,
    onCloseRemoveModal,
    processingId,
    existingFriendIds,
    pendingUserIds,
    highlightedRequestId,
    highlightedUserId,
    totalFriendsCount: friends.length,
    pendingCount: incomingRequests.length,
    filterQuery,
    onFilterChange: setFilterQuery,
    sortMethod,
    onSortChange: setSortMethod,
    friendToRemove,
  };
}
