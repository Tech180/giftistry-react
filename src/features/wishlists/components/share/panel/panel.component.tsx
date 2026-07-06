import React, { useState, useEffect } from 'react';
import { PanelProps } from './interfaces/panel.interface';
import { SharePanelTemplate } from './panel.html';
import { FriendsTab } from './components/tabs/friends/friends.component';
import { LinkTab } from './components/tabs/link/link.component';
import { ShareForm } from '../form/form.component';
import { ShareManagement } from '../management/management.component';
import { wishlistsApi } from 'features/wishlists/api/wishlists.api';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export const SharePanel: React.FC<PanelProps> = ({ listId, isOwner, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'email' | 'link' | 'manage'>('friends');
  const [shares, setShares] = useState<ListShare[]>([]);

  const loadShares = async () => {
    try {
      const result = await wishlistsApi.listShares(listId);
      setShares(result || []);
    } catch (err) {
      console.error('Failed to load shares:', err);
    }
  };

  useEffect(() => {
    loadShares();
  }, [listId]);

  const handleSuccess = () => {
    loadShares();
    onSuccess?.();
  };

  const collaboratorsCount = shares.length;

  return (
    <SharePanelTemplate
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isOwner={isOwner}
      manageCount={collaboratorsCount}
      friendsTab={<FriendsTab listId={listId} shares={shares} onSuccess={handleSuccess} />}
      emailTab={<ShareForm listId={listId} onSuccess={handleSuccess} />}
      linkTab={<LinkTab listId={listId} isOwner={isOwner} />}
      manageTab={<ShareManagement listId={listId} isOwner={isOwner} />}
    />
  );
};
