export interface InactivityModalProps {
  isOpen: boolean;
  countdown: number;
  onExtendSession: () => void;
  onSignOut: () => void;
}
