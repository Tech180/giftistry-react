export interface Props {
  isOpen: boolean;
  countdown: number;
  onExtendSession: () => void;
  onSignOut: () => void;
}
