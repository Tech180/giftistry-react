import React, { useState } from 'react';
import { FriendsTab } from '../panel/components/tabs/friends/friends.component';
import { LinkTab } from '../panel/components/tabs/link/link.component';
import { ShareManagement } from '../management/management.component';
import { useShares } from '../../../hooks/use-shares';
import { TABS } from './constants/tabs.constant';
import type { Props } from './interfaces/props.interface';
import type { Tab } from './interfaces/tab.type';
import { FabPanelTemplate } from './fab-panel.html';

export const FabPanel: React.FC<Props> = ({
  listId,
  isOwner,
  onClose,
  onSuccess,
  ownerInfo,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('link');
  const [hideTabs, setHideTabs] = useState(false);
  const { shares, loadShares } = useShares(listId);

  const handleSuccess = () => {
    void loadShares();
    onSuccess?.();
  };

  return (
    <FabPanelTemplate
      activeTab = {
        activeTab
      }
      setActiveTab = {
        setActiveTab
      }
      onClose = {
        onClose
      }
      hideTabs = {
        hideTabs
      }
      tabs = {
        TABS
      }
      linkTab = {
        <LinkTab
          listId = {
            listId
          }
          isOwner = {
            isOwner
          }
          variant = {
            'compact'
          }
        />
      }
      inviteTab = {
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
          variant = {
            'compact'
          }
        />
      }
      accessTab = {
        <ShareManagement
          listId = {
            listId
          }
          isOwner = {
            isOwner
          }
          variant = {
            'compact'
          }
          ownerInfo = {
            ownerInfo
          }
          onCautionModeChange = {
            setHideTabs
          }
        />
      }
    />
  );
};
