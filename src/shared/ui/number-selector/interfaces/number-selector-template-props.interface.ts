import type { ReactNode } from 'react';

export interface NumberSelectorTemplateProps {
  value: number;
  displayValue: ReactNode;
  disabled: boolean;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  size: 'sm' | 'md';
  className: string;
  editable: boolean;
  isEditing: boolean;
  draft: string;
  onStartEdit: () => void;
  onDraftChange: (next: string) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  editLabel: string;
}
