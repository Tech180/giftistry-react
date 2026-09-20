import type React from 'react';

export interface UseSummarizeNotesResult {
  isSummarizingNotes: boolean;
  setIsSummarizingNotes: React.Dispatch<React.SetStateAction<boolean>>;
  undoDescription: string | null;
  setUndoDescription: React.Dispatch<React.SetStateAction<string | null>>;
  canSummarizeNotes: boolean;
  handleSummarizeNotes: () => Promise<void>;
  handleUndoSummarize: () => void;
}
