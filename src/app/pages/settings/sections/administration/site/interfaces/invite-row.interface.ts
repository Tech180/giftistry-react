export interface InviteRow {
  id: string;
  displayUrl: string;
  statusLabel: string;
  statusClassName: string;
  expiresLabel: string;
  copied: boolean;
  canCopy: boolean;
  isDeleting: boolean;
  onCopy: () => void;
  onDelete: () => void;
}
