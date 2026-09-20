import { File, MessageSquare, Pencil, Tag, Terminal, type LucideIcon } from 'lucide-react';
import type { PromptWorkspaceIcon } from '../interfaces/prompt-workspace-icon.type';

export const PROMPT_WORKSPACE_ICON_COMPONENTS: Record<PromptWorkspaceIcon, LucideIcon> = {
  terminal: Terminal,
  message: MessageSquare,
  file: File,
  edit: Pencil,
  tag: Tag,
};
