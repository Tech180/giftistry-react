import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Archive,
  ArchiveRestore,
  BookCopy,
  Download,
  MessageSquare,
  Settings,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react';
import { ShareFabPanel } from 'features/wishlists';
import { ImportMenuPanel } from 'features/items';
import { TOUR_TARGETS } from 'features/tour';
import { useRegisterActions } from 'app/providers/mobile-page-actions';
import type { FloatingAction } from 'shared/ui';
import { UserAvatar } from 'shared/ui';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { getInitialsFromDisplayName } from 'shared/utils/get-initials.util';
import {
  exportToCsv,
  exportToJson,
  exportToPdf,
  exportToTxt,
  exportToXlsx,
} from 'shared/utils/wishlist-export';
import { ConfirmPanel } from '../confirm-panel/confirm-panel.component';
import { SettingsPanel } from '../settings-panel/settings-panel.component';
import {
  SETTINGS_PANEL_HEADER,
  SETTINGS_PANEL_PAD,
  SETTINGS_PANEL_WIDTH,
  SETTINGS_ROW_GAP,
  SETTINGS_ROW_HEIGHT,
} from '../../constants/settings-panel-layout.constant';
import type { Props } from './interfaces/props.interface';
import styles from './mobile-actions.module.css';

/** Null-render host that registers wishlist-detail floating actions. */
export function MobileActions({
  wishlist,
  isOwner,
  canCollaborate,
  isArchived,
  isLocked,
  canShowAi,
  canShowWebSearch,
  isDeactivating,
  isActivating,
  isDeleting,
  isDuplicating,
  isMobileFab,
  user,
  reloadListContent,
  handleDuplicate,
  handleActivateConfirm,
  handleDeactivateConfirm,
  handleDeleteConfirm,
  setIsCommentsOpen,
  setIsShareOpen,
  toggleAiEnabled,
  toggleWebSearchEnabled,
  toggleManualJobBackground,
  toggleAutoRollover,
  toggleAllowGroupFunds,
}: Props): null {
  const navigate = useNavigate();

  const shareOwnerInfo = useMemo(() => {
    if (!user) {
      return undefined;
    }

    const displayName = getDisplayName(user, 'You');
    const initials =
      user.FirstName || user.LastName
        ? `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`.toUpperCase()
        : user.Username?.substring(0, 2).toUpperCase() || '??';
    return { displayName, initials };
  }, [user]);

  const pageActions = useMemo((): FloatingAction[] => {
    if (!wishlist) {
      return [];
    }

    const exporterName = user?.FirstName || user?.Username || 'Export';
    const exportContext = {
      exporterName,
      isOwner,
      currentUserId: user?.Id,
    };

    const actions: FloatingAction[] = [];

    actions.push({
      id: 'duplicate',
      label: isDuplicating ? 'Duplicating…' : 'Duplicate',
      icon: <BookCopy size={18} aria-hidden />,
      disabled: isDuplicating,
      panelWidth: 280,
      panelHeight: 220,
      panelContent: ({ closeMenu }) => (
        <ConfirmPanel
          tone="primary"
          message={isOwner ? 'Duplicate this list?' : 'Duplicate this list for yourself?'}
          yesDisabled={isDuplicating}
          onYes={() => {
            closeMenu();
            handleDuplicate();
          }}
          onNo={closeMenu}
        />
      ),
    });

    if (canCollaborate && !isLocked) {
      actions.push({
        id: 'import',
        label: 'Import',
        icon: <Upload size={18} aria-hidden />,
        tourTarget: TOUR_TARGETS.importFab,
        hideToolbarDivider: true,
        panelWidth: 288,
        panelHeight: 268,
        hidePanelHeader: true,
        panelContent: ({ closeMenu, backToToolbar, setPanelSize, setPanelEscapeHandler }) => (
          <ImportMenuPanel
            mode="existing-list"
            listId={wishlist.Id}
            allowAi={Boolean(canShowAi && wishlist.AiEnabled)}
            onClose={backToToolbar}
            onSizeChange={setPanelSize}
            setPanelEscapeHandler={setPanelEscapeHandler}
            onImported={() => {
              closeMenu();
              void reloadListContent();
            }}
          />
        ),
      });
    }

    actions.push({
      id: 'export',
      label: 'Export',
      icon: <Download size={18} aria-hidden />,
      hideToolbarDivider: true,
      separateAfter: true,
      children: [
        {
          id: 'csv',
          label: 'CSV',
          onClick: () => exportToCsv(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'xlsx',
          label: 'XLSX',
          onClick: () => exportToXlsx(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'txt',
          label: 'TXT',
          onClick: () => exportToTxt(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'json',
          label: 'JSON',
          onClick: () => exportToJson(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'pdf',
          label: 'PDF',
          onClick: () => exportToPdf(wishlist.Id, wishlist.Title, exportContext),
        },
      ],
    });

    actions.push({
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare size={18} aria-hidden />,
      tourTarget: TOUR_TARGETS.commentsFab,
      onClick: () => setIsCommentsOpen((prev) => !prev),
    });

    if (isOwner) {
      const shareAction: FloatingAction = isMobileFab
        ? {
            id: 'share',
            label: 'Share',
            icon: <Share2 size={18} aria-hidden />,
            tourTarget: TOUR_TARGETS.shareFab,
            panelWidth: 320,
            panelHeight: 380,
            hidePanelHeader: true,
            panelContent: ({ closeMenu }) => (
              <ShareFabPanel
                listId={wishlist.Id}
                isOwner={isOwner}
                onClose={closeMenu}
                onSuccess={() => {
                  void reloadListContent();
                }}
                ownerInfo={shareOwnerInfo}
              />
            ),
          }
        : {
            id: 'share',
            label: 'Share',
            icon: <Share2 size={18} aria-hidden />,
            tourTarget: TOUR_TARGETS.shareFab,
            onClick: () => setIsShareOpen(true),
          };

      actions.unshift(shareAction);

      if (isArchived) {
        actions.push(
          {
            id: 'restore',
            label: 'Restore',
            icon: <ArchiveRestore size={18} aria-hidden />,
            disabled: isDeactivating || isActivating || isDeleting,
            toolbarTone: 'default',
            panelWidth: 280,
            panelHeight: 220,
            panelContent: ({ closeMenu }) => (
              <ConfirmPanel
                tone="warning"
                message="Are you sure you want to restore this wishlist from the archive?"
                yesDisabled={isActivating}
                onYes={() => {
                  closeMenu();
                  handleActivateConfirm();
                }}
                onNo={closeMenu}
              />
            ),
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 size={18} aria-hidden />,
            disabled: isDeactivating || isActivating || isDeleting,
            toolbarTone: 'danger',
            hideToolbarDivider: true,
            panelWidth: 280,
            panelHeight: 220,
            panelContent: ({ closeMenu }) => (
              <ConfirmPanel
                tone="danger"
                message="Are you sure you want to permanently delete this wishlist and all of its items?"
                yesDisabled={isDeleting}
                onYes={() => {
                  closeMenu();
                  handleDeleteConfirm();
                }}
                onNo={closeMenu}
              />
            ),
          }
        );
      } else {
        actions.push({
          id: 'archive',
          label: 'Archive',
          icon: <Archive size={18} aria-hidden />,
          disabled: isDeactivating || isActivating || isDeleting,
          toolbarTone: 'default',
          panelWidth: 280,
          panelHeight: 220,
          panelContent: ({ closeMenu }) => (
            <ConfirmPanel
              tone="warning"
              message="Are you sure you want to deactivate and archive this wishlist?"
              yesDisabled={isDeactivating}
              onYes={() => {
                closeMenu();
                handleDeactivateConfirm();
              }}
              onNo={closeMenu}
            />
          ),
        });
      }
    }

    const listSettingsReadOnly = !isOwner || isArchived;
    const settingsRowCount = listSettingsReadOnly
      ? 5
      : 2 + (canShowAi ? 1 : 0) + (canShowWebSearch ? 1 : 0) + (canShowAi ? 1 : 0);
    actions.push({
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} aria-hidden />,
      tourTarget: TOUR_TARGETS.settingsFab,
      toolbarTone: listSettingsReadOnly ? 'default' : undefined,
      toolbarMuted: listSettingsReadOnly,
      panelWidth: SETTINGS_PANEL_WIDTH,
      panelHeight:
        SETTINGS_PANEL_PAD +
        SETTINGS_PANEL_HEADER +
        settingsRowCount * SETTINGS_ROW_HEIGHT +
        Math.max(0, settingsRowCount - 1) * SETTINGS_ROW_GAP,
      panelContent: (
        <SettingsPanel
          aiEnabled={!!wishlist.AiEnabled}
          webSearchEnabled={!!wishlist.WebSearchEnabled}
          manualJobBackground={wishlist.ManualJobBackground !== false}
          autoRollover={wishlist.AutoRollover === true}
          allowGroupFunds={wishlist.AllowGroupFunds === true}
          canShowAi={canShowAi}
          canShowWebSearch={canShowWebSearch}
          readOnly={listSettingsReadOnly}
          onToggleAi={toggleAiEnabled}
          onToggleWebSearch={toggleWebSearchEnabled}
          onToggleManualJobBackground={toggleManualJobBackground}
          onToggleAutoRollover={toggleAutoRollover}
          onToggleAllowGroupFunds={toggleAllowGroupFunds}
        />
      ),
    });

    if (!isOwner && wishlist.UserId) {
      const ownerDisplayName =
        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner';
      const ownerInitials = getInitialsFromDisplayName(ownerDisplayName);
      actions.unshift({
        id: 'owner',
        label: `View owner: ${ownerDisplayName}`,
        icon: (
          <UserAvatar
            avatar={wishlist.OwnerAvatar}
            alt={ownerDisplayName}
            initials={ownerInitials}
            className={styles['mobile-actions__owner-avatar']}
            imageClassName={styles['mobile-actions__owner-avatar-img']}
            initialsClassName={styles['mobile-actions__owner-avatar-initials']}
          />
        ),
        toolbarTone: 'default',
        onClick: () => {
          navigate(`/users/${wishlist.UserId}`);
        },
      });
    }

    return actions;
  }, [
    wishlist,
    user,
    isOwner,
    canCollaborate,
    isArchived,
    isLocked,
    canShowAi,
    canShowWebSearch,
    isDeactivating,
    isActivating,
    isDeleting,
    isDuplicating,
    handleDuplicate,
    reloadListContent,
    isMobileFab,
    shareOwnerInfo,
    navigate,
    handleActivateConfirm,
    handleDeactivateConfirm,
    handleDeleteConfirm,
    setIsCommentsOpen,
    setIsShareOpen,
    toggleAiEnabled,
    toggleWebSearchEnabled,
    toggleManualJobBackground,
    toggleAutoRollover,
    toggleAllowGroupFunds,
  ]);

  useRegisterActions(pageActions);
  return null;
}
