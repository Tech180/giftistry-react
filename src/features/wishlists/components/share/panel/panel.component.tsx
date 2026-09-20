import React, { useState } from 'react';
import { Props } from './interfaces/props.interface';
import { SharePanelTemplate } from './panel.html';
import { FriendsTab } from './components/tabs/friends/friends.component';
import { LinkTab } from './components/tabs/link/link.component';
import { ShareManagement } from '../management/management.component';
import { useShares } from '../../../hooks/use-shares';

export const SharePanel: React.FC<Props> = ({ listId, isOwner, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'link' | 'manage'>('friends');
  const { shares, loadShares } = useShares(listId);

  const handleSuccess = () => {
    void loadShares();
    onSuccess?.();
  };

  const collaboratorsCount = shares.length;

  return (
    <SharePanelTemplate
      activeTab = {
        activeTab
      }
      setActiveTab = {
        setActiveTab
      }
      isOwner = {
        isOwner
      }
      manageCount = {
        collaboratorsCount
      }
      friendsTab = {
        <FriendsTab
          listId = {
            listId
          }
          shares = {
            shares
          }
          onSuccess = {
            handleSuccess
          }
        />
      }
      linkTab = {
        <LinkTab
          listId = {
            listId
          }
          isOwner = {
            isOwner
          }
        />
      }
      manageTab = {
        <ShareManagement
          listId = {
            listId
          }
          isOwner = {
            isOwner
          }
        />
      }
    />
  );
};
