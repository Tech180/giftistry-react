import React from 'react';
import { Priority } from 'features/wishlists';

export interface AddItemFormTemplateProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  priorityId: string;
  setPriorityId: (val: string) => void;
  isHiddenIdea: boolean;
  setIsHiddenIdea: (val: boolean) => void;
  priorities: Priority[];
  isOwner: boolean;
  isLoading: boolean;
  errorMsg: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}
