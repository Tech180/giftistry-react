export interface CommentRow {
  id: string;
  listTitle: string;
  authorLabel: string;
  contentLabel: string;
  isDeleted: boolean;
  onDelete: () => void;
}
