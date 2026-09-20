import type { AiConnectionStatus } from 'features/system';
import type { AiModelSlot } from 'features/system';
import type { SystemModelsProvider } from 'features/system';

export interface ConnectionPanelProps {
  aiEnabled: boolean;
  connectionSlot: AiModelSlot;
  setConnectionSlot: (slot: AiModelSlot) => void;
  isFastSlot: boolean;
  activeProvider: SystemModelsProvider;
  setActiveProvider: (value: SystemModelsProvider) => void;
  activeEndpoint: string;
  setActiveEndpoint: (value: string) => void;
  activeApiKey: string;
  setActiveApiKey: (value: string) => void;
  showActiveAiKey: boolean;
  setShowActiveAiKey: (value: boolean) => void;
  activeConnectionStatus: AiConnectionStatus;
  activeConnectionMessage: string;
  isTestingAiConnection: boolean;
  onTestAiConnection: (slot: AiModelSlot) => void;
}
