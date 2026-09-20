import type { ConfirmAction } from './confirm-action.type';

export interface UseListLifecycleResult {
  confirmAction: ConfirmAction;
  setConfirmAction: (action: ConfirmAction) => void;
  isDeactivating: boolean;
  isActivating: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
  handleDeactivateConfirm: () => void;
  handleActivateConfirm: () => void;
  handleDeleteConfirm: () => void;
  handleDuplicate: () => void;
}
