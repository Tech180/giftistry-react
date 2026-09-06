export interface DemotionCautionViewProps {
  title: string;
  description: string;
  proceedPrompt: string;
  displayName: string | null;
  username: string | null;
  avatar: string | null;
  error: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
