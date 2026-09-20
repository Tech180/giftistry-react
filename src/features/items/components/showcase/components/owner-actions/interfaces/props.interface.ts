export interface Props {
  isArchived: boolean;
  isExpired: boolean;
  onEdit?: () => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (val: boolean) => void;
  deleteLoading: boolean;
  handleDelete: () => void;
}
