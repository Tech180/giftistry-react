import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Sparkles, Users, Archive, Upload, Plus } from 'lucide-react';
import { useWishlistController } from 'features/wishlists';
import { ImportMenuPanel } from 'features/items/components/import/import-menu-panel/import-menu-panel.component';
import type { ImportStripHandle } from 'features/items/components/import/import-strip/interfaces/import-strip-handle.interface';
import { useAuth } from 'app/providers/auth-context';
import { useRegisterPageActions } from 'app/providers/mobile-page-actions-context';
import type { FloatingAction } from 'shared/ui';
import { DashboardTemplate } from './dashboard.html';

const TAB_CONFIG = [
  { id: 'my-lists', label: 'My Wishlists' },
  { id: 'shared', label: 'Shared' },
  { id: 'archive', label: 'Archived' },
] as const;

function tabToBucket(tab: 'my-lists' | 'shared' | 'archive'): 'my' | 'shared' | 'archive' {
  if (tab === 'my-lists') return 'my';
  if (tab === 'shared') return 'shared';
  return 'archive';
}

export default function Dashboard() {
  const { user, canShowAi } = useAuth();
  const { wishlists, counts, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importStripRef = useRef<ImportStripHandle>(null);
  const [activeTab, setActiveTab] = useState<'my-lists' | 'shared' | 'archive'>('my-lists');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleImportStarted = useCallback((_result: { listId: string }) => {
    void fetchWishlists({
      bucket: tabToBucket(activeTab),
      q: debouncedSearch || undefined,
    });
  }, [fetchWishlists, activeTab, debouncedSearch]);

  const pageActions = useMemo((): FloatingAction[] => {
    return [
      {
        id: 'import',
        label: 'Import',
        icon: <Upload size={18} aria-hidden />,
        panelWidth: 288,
        panelHeight: 268,
        hidePanelHeader: true,
        panelContent: ({ closeMenu, setPanelSize, setPanelEscapeHandler }) => (
          <ImportMenuPanel
            mode="create-list"
            allowAi={canShowAi}
            onClose={closeMenu}
            onSizeChange={setPanelSize}
            setPanelEscapeHandler={setPanelEscapeHandler}
            onImported={(result) => {
              closeMenu();
              handleImportStarted(result);
            }}
          />
        ),
      },
      {
        id: 'create',
        label: 'New Wishlist',
        icon: <Plus size={18} aria-hidden />,
        onClick: () => setIsCreateOpen(true),
      },
    ];
  }, [canShowAi, handleImportStarted]);

  useRegisterPageActions(pageActions);

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
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    void fetchWishlists({
      bucket: tabToBucket(activeTab),
      q: debouncedSearch || undefined,
    });
  }, [fetchWishlists, activeTab, debouncedSearch]);

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    void fetchWishlists({
      bucket: tabToBucket(activeTab),
      q: debouncedSearch || undefined,
    });
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    const name = user?.FirstName || user?.Username || 'there';
    if (hours < 12) return `Good morning, ${name}`;
    if (hours < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const tabs = useMemo(() => {
    const tabCounts: Record<string, number> = {
      'my-lists': counts.My,
      shared: counts.Shared,
      archive: counts.Archive,
    };
    return TAB_CONFIG.map((t) => ({
      id: t.id,
      label: t.label,
      count: tabCounts[t.id],
    }));
  }, [counts.My, counts.Shared, counts.Archive]);

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
      canShowAi={canShowAi}
      importStripRef={importStripRef}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      tabs={tabs}
      currentLists={wishlists}
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
