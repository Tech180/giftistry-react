import React, { useEffect, useState, useMemo } from 'react';
import { useWishlistController } from 'features/wishlists';
import { useAuth } from 'app/providers/AuthContext';
import { DashboardTemplate } from './dashboard.html';

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlists, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-lists' | 'shared' | 'archive'>('my-lists');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    fetchWishlists();
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    const name = user?.FirstName || user?.Username || 'there';
    if (hours < 12) return `Good morning, ${name}`;
    if (hours < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  // Group lists by context
  const { myLists, sharedLists, archivedLists } = useMemo(() => {
    const my: typeof wishlists = [];
    const shared: typeof wishlists = [];
    const archived: typeof wishlists = [];

    wishlists.forEach((list) => {
      if (isExpired(list.ExpiresAt)) {
        archived.push(list);
      } else if (list.Role === 'owner' || !list.Role) {
        my.push(list);
      } else {
        shared.push(list);
      }
    });

    return { myLists: my, sharedLists: shared, archivedLists: archived };
  }, [wishlists]);

  // Filter current list group by search query
  const currentLists = useMemo(() => {
    let lists = [];
    switch (activeTab) {
      case 'shared':
        lists = sharedLists;
        break;
      case 'archive':
        lists = archivedLists;
        break;
      case 'my-lists':
      default:
        lists = myLists;
        break;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return lists.filter((list) =>
        list.Title.toLowerCase().includes(query) ||
        (list.Category && list.Category.toLowerCase().includes(query)) ||
        (list.OwnerFirstName && list.OwnerFirstName.toLowerCase().includes(query))
      );
    }

    return lists;
  }, [activeTab, myLists, sharedLists, archivedLists, searchQuery]);

  return (
    <DashboardTemplate
      getGreeting={getGreeting}
      isCreateOpen={isCreateOpen}
      setIsCreateOpen={setIsCreateOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      myLists={myLists}
      sharedLists={sharedLists}
      archivedLists={archivedLists}
      currentLists={currentLists}
      isLoading={isLoading}
      error={error}
      handleCreateSuccess={handleCreateSuccess}
    />
  );
}
