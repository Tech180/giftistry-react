export interface LinkTabProps {
  listId: string;
  isOwner: boolean;
}

export interface LinkTabTemplateProps {
  isOwner: boolean;
  isLoading: boolean;
  isGenerating: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  activeInvite: any;
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
}
