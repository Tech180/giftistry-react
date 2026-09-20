export interface TemplateProps {
  onEdit: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onRequestDelete: () => void;
  deleteLoading: boolean;
  rootClassName: string;
  editButtonClassName: string;
  deleteButtonClassName: string;
  actionIconClassName: string;
  confirmWidgetClassName: string;
  confirmPromptClassName: string;
  confirmButtonsClassName: string;
}
