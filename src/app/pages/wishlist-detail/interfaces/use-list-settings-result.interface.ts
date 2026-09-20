export interface UseListSettingsResult {
  saveTitle: (title: string) => Promise<void>;
  saveDate: (date: string) => Promise<void>;
  toggleAiEnabled: () => void;
  toggleWebSearchEnabled: () => void;
  toggleManualJobBackground: () => void;
  toggleAutoRollover: () => void;
  toggleAllowGroupFunds: () => void;
  canUseWebSearchOnList: boolean;
}
