import React from 'react';
import type { ConnectionPanelProps } from './interfaces/props.interface';
import { ConnectionPanelTemplate } from './connection-panel.html';

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  aiEnabled,
  connectionSlot,
  setConnectionSlot,
  isFastSlot,
  activeProvider,
  setActiveProvider,
  activeEndpoint,
  setActiveEndpoint,
  activeApiKey,
  setActiveApiKey,
  showActiveAiKey,
  setShowActiveAiKey,
  activeConnectionStatus,
  activeConnectionMessage,
  isTestingAiConnection,
  onTestAiConnection,
}) => (
  <ConnectionPanelTemplate
    aiEnabled = {
      aiEnabled
    }
    connectionSlot = {
      connectionSlot
    }
    setConnectionSlot = {
      setConnectionSlot
    }
    isFastSlot = {
      isFastSlot
    }
    activeProvider = {
      activeProvider
    }
    setActiveProvider = {
      setActiveProvider
    }
    activeEndpoint = {
      activeEndpoint
    }
    setActiveEndpoint = {
      setActiveEndpoint
    }
    activeApiKey = {
      activeApiKey
    }
    setActiveApiKey = {
      setActiveApiKey
    }
    showActiveAiKey = {
      showActiveAiKey
    }
    setShowActiveAiKey = {
      setShowActiveAiKey
    }
    activeConnectionStatus = {
      activeConnectionStatus
    }
    activeConnectionMessage = {
      activeConnectionMessage
    }
    isTestingAiConnection = {
      isTestingAiConnection
    }
    onTestAiConnection = {
      onTestAiConnection
    }
  />
);

export default ConnectionPanel;
