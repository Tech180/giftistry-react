import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { useWishlistController, isWishlistInArchiveBucket } from 'features/wishlists';
import { ImportMenuPanel, type ImportStripHandle } from 'features/items';
import { useAuth } from 'features/auth';
import {
  TOUR_TARGETS,
  useTourDemoOptional,
  useTourOptional,
  isDemoListId,
  TOUR_DEMO_LIST_ID,
} from 'features/tour';
import type { FloatingAction } from 'shared/ui';
import { DASHBOARD_EMPTY_COPY } from '../constants/dashboard-empty-copy.constant';
import { DASHBOARD_TABS } from '../constants/dashboard-tabs.constant';
import { SEARCH_DEBOUNCE_MS } from '../constants/search-debounce-ms.constant';
import type { DashboardTabId } from '../interfaces/dashboard-tab-id.type';
import type { UseDashboardResult } from '../interfaces/use-dashboard-result.interface';
import { getDashboardGreeting } from '../utils/get-dashboard-greeting.util';
import { isDashboardTabId } from '../utils/is-dashboard-tab-id.util';
import { tabToBucket } from '../utils/tab-to-bucket.util';
import { useDashboardGridColumns } from './use-dashboard-grid-columns';

export function useDashboard(): UseDashboardResult {
  const { user, canShowAi } = useAuth();
  const tour = useTourOptional();
  const demo = useTourDemoOptional();
  const { wishlists, counts, isLoading, error, fetchWishlists } = useWishlistController();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importStripRef = useRef<ImportStripHandle>(null);
  const [activeTab, setActiveTab] = useState<DashboardTabId>('my-lists');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { columns, gridRef } = useDashboardGridColumns();

  const reload = useCallback(() => {
    void fetchWishlists({
      bucket: tabToBucket(activeTab),
      q: debouncedSearch || undefined,
    });
  }, [fetchWishlists, activeTab, debouncedSearch]);

  const handleImportStarted = useCallback((_result: { listId: string }) => {
    reload();
  }, [reload]);

  const pageActions = useMemo((): FloatingAction[] => [
    {
      id: 'import',
      label: 'Import',
      icon: <Upload size={18} aria-hidden />,
      tourTarget: TOUR_TARGETS.importFab,
      panelWidth: 288,
      panelHeight: 268,
      hidePanelHeader: true,
      panelContent: ({ closeMenu, backToToolbar, setPanelSize, setPanelEscapeHandler }) => (
        <ImportMenuPanel
          mode="create-list"
          allowAi={canShowAi}
          onClose={backToToolbar}
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
      tourTarget: TOUR_TARGETS.createWishlistFabAction,
      onClick: () => setIsCreateOpen(true),
    },
  ], [canShowAi, handleImportStarted]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    reload();
  }, [reload]);

  const greeting = getDashboardGreeting(user?.FirstName || user?.Username || 'there');

  const tabs = useMemo(() => {
    const countByTab: Record<DashboardTabId, number> = {
      'my-lists': counts.My,
      shared: counts.Shared,
      archive: counts.Archive,
    };
    return DASHBOARD_TABS.map((t) => ({
      id: t.id,
      label: t.label,
      count: countByTab[t.id],
    }));
  }, [counts.My, counts.Shared, counts.Archive]);

  const empty = DASHBOARD_EMPTY_COPY[activeTab];
  const EmptyIcon = empty.Icon;
  const emptyIcon = <EmptyIcon size={32} />;

  const showDemoCard =
    activeTab === 'my-lists' &&
    (demo?.active === true || tour?.activeChapterId === 'demo') &&
    demo?.wishlist != null;

  const cards = useMemo(() => {
    const mapped = wishlists.map((wishlist) => ({
      wishlist,
      isArchived: isWishlistInArchiveBucket(wishlist),
      tourTarget:
        wishlist.Id === tour?.createdListId || isDemoListId(wishlist.Id)
          ? TOUR_TARGETS.tourListCard
          : undefined,
    }));

    if (!showDemoCard || !demo?.wishlist) {
      return mapped;
    }

    return [
      {
        wishlist: demo.wishlist,
        isArchived: false,
        tourTarget: TOUR_TARGETS.tourListCard,
      },
      ...mapped.filter((card) => card.wishlist.Id !== TOUR_DEMO_LIST_ID),
    ];
  }, [wishlists, tour?.createdListId, showDemoCard, demo?.wishlist]);

  return {
    pageActions,
    greeting,
    isCreateOpen,
    isImportOpen,
    canShowAi,
    importStripRef,
    activeTab,
    searchQuery,
    tabs,
    cards,
    isLoading,
    error,
    emptyIcon,
    emptyTitle: empty.title,
    emptyDesc: empty.description,
    showCreateAction: activeTab === 'my-lists',
    gridRef,
    columns,
    onToggleImport: () => setIsImportOpen((open) => !open),
    onOpenCreate: () => setIsCreateOpen(true),
    onCloseCreate: () => setIsCreateOpen(false),
    onTabChange: (tabId: string) => {
      if (isDashboardTabId(tabId)) {
        setActiveTab(tabId);
      }
    },
    onSearchChange: setSearchQuery,
    onCreateSuccess: () => {
      setIsCreateOpen(false);
      reload();
    },
    onImportStarted: handleImportStarted,
  };
}
