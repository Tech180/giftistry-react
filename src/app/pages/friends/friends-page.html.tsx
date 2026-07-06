import React, { useState, useEffect, useRef } from 'react';
import { LoadingState, EnterPanel } from 'shared/ui';
import { FriendList, FriendRequestList, UserSearch } from 'features/friends';
import { Search, SlidersHorizontal, AlertTriangle, X } from 'lucide-react';
import { FriendsPageTemplateProps } from './interfaces/friends-page-template-props.interface';
import styles from './friends-page.module.css';

export const FriendsPageTemplate: React.FC<FriendsPageTemplateProps> = ({
  friends,
  incomingRequests,
  outgoingRequests,
  searchResults,
  isLoading,
  isSearching,
  error,
  activeTab,
  setActiveTab,
  onSearch,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
  processingId,
  existingFriendIds,
  pendingUserIds,
  highlightedRequestId,
  highlightedUserId,
  totalFriendsCount,
  filterQuery,
  setFilterQuery,
  sortMethod,
  setSortMethod,
  friendToRemove,
  setFriendToRemove,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sortLabels = {
    name: 'Name (A-Z)',
    recent: 'Recently Added',
    birthday: 'Upcoming Birthdays',
  };

  const requestCount = incomingRequests.length;

  return (
    <EnterPanel animation="fade" className={styles.container}>
      {/* Header and Stats */}
      <div className={styles.header}>
        <div className={styles['header-left']}>
          <h1 className={styles.title}>Friends & Connections</h1>
          <p className={styles.subtitle}>
            Manage your network, view upcoming birthdays, and track wishlists.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Total Friends</span>
            <span className={styles['stat-val']}>{totalFriendsCount}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Pending</span>
            <span className={styles['stat-val']}>{requestCount}</span>
          </div>
        </div>
      </div>

      {error && <div className={styles['error-banner']}>{error}</div>}

      {/* Unified Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles['tabs-container']}>
          <button
            type="button"
            className={`${styles['tab-button']} ${activeTab === 'current' ? styles['active-tab-button'] : ''}`}
            onClick={() => setActiveTab('current')}
          >
            My Friends
          </button>
          <button
            type="button"
            className={`${styles['tab-button']} ${activeTab === 'requests' ? styles['active-tab-button'] : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
            {requestCount > 0 && <span className={styles['tab-dot']} />}
          </button>
          <button
            type="button"
            className={`${styles['tab-button']} ${activeTab === 'search' ? styles['active-tab-button'] : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Discover
          </button>
        </div>

        {activeTab === 'current' && (
          <div className={styles['toolbar-actions']}>
            <div className={styles['filter-wrapper']}>
              <Search size={14} className={styles['filter-icon']} />
              <input
                type="text"
                placeholder="Filter..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className={styles['filter-input']}
              />
            </div>

            <div className={styles['sort-dropdown-container']} ref={dropdownRef}>
              <button
                type="button"
                className={styles['sort-button']}
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <SlidersHorizontal size={14} />
                <span>{sortLabels[sortMethod]}</span>
              </button>

              {isSortOpen && (
                <div className={styles['sort-dropdown-menu']}>
                  <button
                    type="button"
                    className={`${styles['sort-dropdown-item']} ${sortMethod === 'name' ? styles['active'] : ''}`}
                    onClick={() => {
                      setSortMethod('name');
                      setIsSortOpen(false);
                    }}
                  >
                    Name (A-Z)
                  </button>
                  <button
                    type="button"
                    className={`${styles['sort-dropdown-item']} ${sortMethod === 'recent' ? styles['active'] : ''}`}
                    onClick={() => {
                      setSortMethod('recent');
                      setIsSortOpen(false);
                    }}
                  >
                    Recently Added
                  </button>
                  <button
                    type="button"
                    className={`${styles['sort-dropdown-item']} ${sortMethod === 'birthday' ? styles['active'] : ''}`}
                    onClick={() => {
                      setSortMethod('birthday');
                      setIsSortOpen(false);
                    }}
                  >
                    Upcoming Birthdays
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles['content-card']}>
        {isLoading ? (
          <LoadingState message="Loading friends..." />
        ) : (
          <>
            {activeTab === 'current' && (
              <FriendList
                friends={friends}
                onRemove={(friendId) => {
                  const friend = friends.find((f) => f.UserId === friendId);
                  if (friend) {
                    setFriendToRemove({
                      id: friendId,
                      name: friend.FirstName
                        ? `${friend.FirstName} ${friend.LastName || ''}`.trim()
                        : friend.Username,
                    });
                  }
                }}
                removingId={processingId}
                highlightedUserId={highlightedUserId}
              />
            )}
            {activeTab === 'requests' && (
              <FriendRequestList
                incoming={incomingRequests}
                outgoing={outgoingRequests}
                onAccept={onAcceptRequest}
                onReject={onRejectRequest}
                processingId={processingId}
                highlightedRequestId={highlightedRequestId}
              />
            )}
            {activeTab === 'search' && (
              <UserSearch
                searchResults={searchResults}
                isSearching={isSearching}
                onSearch={onSearch}
                onSendRequest={onSendRequest}
                sendingId={processingId}
                existingFriendIds={existingFriendIds}
                pendingUserIds={pendingUserIds}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {friendToRemove && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-card']}>
            <div className={styles['modal-header']}>
              <div className={styles['modal-warning-icon']}>
                <AlertTriangle size={18} />
              </div>
              <h3 className={styles['modal-title']}>Remove Friend</h3>
              <button
                type="button"
                className={styles['modal-close-btn']}
                onClick={() => setFriendToRemove(null)}
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles['modal-body']}>
              <p>
                Are you sure you want to remove <strong>{friendToRemove.name}</strong> from your friends list? This will also remove you from their friends list.
              </p>
            </div>
            <div className={styles['modal-footer']}>
              <button
                type="button"
                className={styles['modal-cancel-btn']}
                onClick={() => setFriendToRemove(null)}
                disabled={processingId === friendToRemove.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles['modal-danger-btn']}
                onClick={() => onRemoveFriend(friendToRemove.id)}
                disabled={processingId === friendToRemove.id}
              >
                {processingId === friendToRemove.id ? 'Removing...' : 'Remove Friend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </EnterPanel>
  );
};
