import React, { useEffect, useState } from 'react';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { FriendsTab } from '../panel/components/tabs/friends/friends.component';
import { LinkTab } from '../panel/components/tabs/link/link.component';
import { ShareManagement } from '../management/management.component';
import type { ShareFabPanelProps } from './interfaces/share-fab-panel-props.interface';
import { ShareFabPanelTemplate } from './share-fab-panel.html';

export const ShareFabPanel: React.FC<ShareFabPanelProps> = ({
  listId,
  isOwner,
  onClose,
  onSuccess,
  ownerInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'link' | 'invite' | 'access'>('link');
  const [shares, setShares] = useState<ListShare[]>([]);
  const [hideTabs, setHideTabs] = useState(false);

  const loadShares = async () => {
    try {
      const result = await wishlistsApi.listShares(listId);
      setShares(result || []);
    } catch (err) {
      console.error('Failed to load shares:', err);
    }
  };

  useEffect(() => {
    void loadShares();
  }, [listId]);

  const handleSuccess = () => {
    void loadShares();
    onSuccess?.();
  };

  return (
    <ShareFabPanelTemplate
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onClose={onClose}
      hideTabs={hideTabs}
      linkTab={<LinkTab listId={listId} isOwner={isOwner} variant="compact" />}
      inviteTab={
        <FriendsTab listId={listId} shares={shares} onSuccess={handleSuccess} variant="compact" />
      }
      accessTab={
        <ShareManagement
          listId={listId}
          isOwner={isOwner}
          variant="compact"
          ownerInfo={ownerInfo}
          onCautionModeChange={setHideTabs}
        />
      }
    />
  );
};
