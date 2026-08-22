import type { LinkInvite } from './link-invite.interface';

export interface LinkTabProps {
  listId: string;
  isOwner: boolean;
  variant?: 'classic' | 'compact';
}

export interface LinkTabTemplateProps {
  variant?: 'classic' | 'compact';
  isOwner: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  activeInvite: LinkInvite | null;
  generatedToken: string | null;
  copied: boolean;
  role: 'viewer' | 'collaborator';
  setRole: (r: 'viewer' | 'collaborator') => void;
  hasExpiration: boolean;
  setHasExpiration: (v: boolean) => void;
  expDate: string;
  setExpDate: (d: string) => void;
  expTime: string;
  setExpTime: (t: string) => void;
  hasPassword: boolean;
  setHasPassword: (v: boolean) => void;
  password: string;
  setPassword: (p: string) => void;
  handleGenerate: () => void;
  handleCopy: () => void;
  handleRevoke: () => void;
  handleSettings: () => void;
  handleToggleLink: (enabled: boolean) => void;
}
