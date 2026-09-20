export interface Props {
  isAccountActionLoading: boolean;
  onDisable: () => void;
  onOpenDelete: () => void;
  showDeleteModal: boolean;
  deletePassword: string;
  setDeletePassword: (val: string) => void;
  showDeletePassword: boolean;
  setShowDeletePassword: (val: boolean) => void;
  deleteError: string | null;
  onCloseDeleteModal: () => void;
  onConfirmDeleteAccount: () => void;
}
