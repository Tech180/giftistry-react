import type { LinkInvite } from '../../../../../../../interfaces/link-invite.interface';

export interface TemplateProps {
  variant?: 'classic' | 'compact';
  isOwner: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  errorMsg: string | null;
  statusMsg: string | null;
  statusTone: 'success' | 'warning';
  activeInvite: LinkInvite | null;
  shareUrl: string;
  shareUrlDisplay: string;
  linkEnabled: boolean;
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
  showPassword: boolean;
  onToggleShowPassword: () => void;
  handleGenerate: () => void;
  handleCopy: () => void;
  handleRevoke: () => void;
  handleSettings: () => void;
  handleToggleLink: (enabled: boolean) => void;
}
