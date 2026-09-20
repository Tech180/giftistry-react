export interface Props {
  allowSetup: boolean;
  onAllowSetupChange: (enabled: boolean) => void;
  isSavingAllowSetup: boolean;
  onDeleteServer: () => void;
  isDeletingServer: boolean;
}
