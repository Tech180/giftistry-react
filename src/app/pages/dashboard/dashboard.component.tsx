import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Plus, Sparkles, Users, Archive } from 'lucide-react';
import { useWishlistController } from 'features/wishlists';
import { useAuth } from 'app/providers/auth-context';
import { DashboardTemplate } from './dashboard.html';
import { isWishlistExpired } from 'features/wishlists/utils/is-wishlist-expired.util';

const TAB_CONFIG = [
  { id: 'my-lists', label: 'My Wishlists' },
  { id: 'shared', label: 'Shared' },
  { id: 'archive', label: 'Archived' },
] as const;

export default function Dashboard() {
  const { user } = useAuth();
  const { wishlists, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-lists' | 'shared' | 'archive'>('my-lists');
  const [searchQuery, setSearchQuery] = useState('');

  const [columns, setColumns] = useState(1);
  const observerRef = useRef<ResizeObserver | null>(null);

  const gridRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const gridStyle = window.getComputedStyle(entry.target);
          const gridTemplate = gridStyle.getPropertyValue('grid-template-columns');
          const cols = gridTemplate.trim().split(/\s+/).length;
          setColumns(cols);
        }
      });
      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    fetchWishlists();
  };

  const handleImportStarted = (_result: { listId: string }) => {
    void fetchWishlists();
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    const name = user?.FirstName || user?.Username || 'there';
    if (hours < 12) return `Good morning, ${name}`;
    if (hours < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Group lists by context
  const { myLists, sharedLists, archivedLists } = useMemo(() => {
    const my: typeof wishlists = [];
    const shared: typeof wishlists = [];
    const archived: typeof wishlists = [];

    wishlists.forEach((list) => {
      if (isWishlistExpired(list.ExpiresAt)) {
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

  const tabs = useMemo(() => {
    const tabCounts: Record<string, number> = {
      'my-lists': myLists.length,
      shared: sharedLists.length,
      archive: archivedLists.length,
    };
    return TAB_CONFIG.map((t) => ({
      id: t.id,
      label: t.label,
      count: tabCounts[t.id],
    }));
  }, [myLists.length, sharedLists.length, archivedLists.length]);

  const emptyIcon = useMemo(() => {
    if (activeTab === 'my-lists') return <Sparkles size={32} />;
    if (activeTab === 'shared') return <Users size={32} />;
    return <Archive size={32} />;
  }, [activeTab]);

  const emptyTitle = useMemo(() => {
    if (activeTab === 'my-lists') return 'No active wishlists yet';
    if (activeTab === 'shared') return 'No shared lists right now';
    return 'Your archive is empty';
  }, [activeTab]);

  const emptyDesc = useMemo(() => {
    if (activeTab === 'my-lists') {
      return 'Create your first registry to start adding items and sharing with friends.';
    }
    if (activeTab === 'shared') {
      return 'When friends share their wishlists with you, they will appear here.';
    }
    return 'Expired registry lists will automatically move here.';
  }, [activeTab]);

  return (
    <DashboardTemplate
      getGreeting={getGreeting}
      isCreateOpen={isCreateOpen}
      setIsCreateOpen={setIsCreateOpen}
      isImportOpen={isImportOpen}
      setIsImportOpen={setIsImportOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      tabs={tabs}
      currentLists={currentLists}
      isLoading={isLoading}
      error={error}
      handleCreateSuccess={handleCreateSuccess}
      handleImportStarted={handleImportStarted}
      emptyIcon={emptyIcon}
      emptyTitle={emptyTitle}
      emptyDesc={emptyDesc}
      gridRef={gridRefCallback}
      columns={columns}
    />
  );
}
