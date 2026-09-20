export interface Props {
  deletePassword: string;
  setDeletePassword: (val: string) => void;
  showDeletePassword: boolean;
  setShowDeletePassword: (val: boolean) => void;
  deleteError: string | null;
  isAccountActionLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
