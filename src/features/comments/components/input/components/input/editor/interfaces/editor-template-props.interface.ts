import React from 'react';
import { ListParticipant } from '../../../../../../interfaces/list-participant.interface';

export interface EditorTemplateProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onEditorInput: (event: React.FormEvent<HTMLDivElement>) => void;
  onEditorKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  showMentionSuggestions: boolean;
  mentionCandidates: ListParticipant[];
  activeMentionIndex: number;
  onMentionHover: (index: number) => void;
  onMentionSelect: (index: number) => void;
}
