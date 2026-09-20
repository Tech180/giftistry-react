import React from 'react';
import { EnterPanel } from 'shared/ui';
import { Header } from './components/header/header.component';
import { Controls } from './components/controls/controls.component';
import { Content } from './components/content/content.component';
import { RemoveModal } from './components/remove-modal/remove-modal.component';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = ({
  friends,
  incomingRequests,
  outgoingRequests,
  searchResults,
  isLoading,
  isSearching,
  error,
  activeTab,
  tabs,
  sortOptions,
  onTabChange,
  onSearch,
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
  totalFriendsCount,
  pendingCount,
  filterQuery,
  onFilterChange,
  sortMethod,
  onSortChange,
  friendToRemove,
}) => (
  <EnterPanel
    animation = {
      'fade'
    }
    className = {
      styles['page']
    }
  >
    <Header
      totalFriendsCount = {
        totalFriendsCount
      }
      pendingCount = {
        pendingCount
      }
    />

    {error ? <div className={styles['page__error']}>{error}</div> : null}

    <Controls
      tabs = {
        tabs
      }
      activeTab = {
        activeTab
      }
      onTabChange = {
        onTabChange
      }
      filterQuery = {
        filterQuery
      }
      onFilterChange = {
        onFilterChange
      }
      sortMethod = {
        sortMethod
      }
      onSortChange = {
        onSortChange
      }
      sortOptions = {
        sortOptions
      }
      pendingCount = {
        pendingCount
      }
    />

    <Content
      activeTab = {
        activeTab
      }
      friends = {
        friends
      }
      incomingRequests = {
        incomingRequests
      }
      outgoingRequests = {
        outgoingRequests
      }
      searchResults = {
        searchResults
      }
      isLoading = {
        isLoading
      }
      isSearching = {
        isSearching
      }
      processingId = {
        processingId
      }
      existingFriendIds = {
        existingFriendIds
      }
      pendingUserIds = {
        pendingUserIds
      }
      highlightedRequestId = {
        highlightedRequestId
      }
      highlightedUserId = {
        highlightedUserId
      }
      onSearch = {
        onSearch
      }
      onSendRequest = {
        onSendRequest
      }
      onAcceptRequest = {
        onAcceptRequest
      }
      onRejectRequest = {
        onRejectRequest
      }
      onRequestRemoveFriend = {
        onRequestRemoveFriend
      }
    />

    <RemoveModal
      target = {
        friendToRemove
      }
      processingId = {
        processingId
      }
      onClose = {
        onCloseRemoveModal
      }
      onConfirm = {
        onConfirmRemoveFriend
      }
    />
  </EnterPanel>
);
