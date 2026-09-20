import type { CommentEditorHandle } from '../../editor';

export interface ToolbarPickersProps {
  editorHandle: React.RefObject<CommentEditorHandle | null>;
  setImageUrl?: (url: string | null) => void;
  onUploadError: (message: string | null) => void;
}
