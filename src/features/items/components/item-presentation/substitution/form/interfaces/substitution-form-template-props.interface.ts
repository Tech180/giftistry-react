import type { SyntheticEvent } from 'react';

export interface SubstitutionFormTemplateProps {
  formId?: string;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  linkUrl: string;
  setLinkUrl: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  websiteName: string;
  setWebsiteName: (value: string) => void;
  isLoading: boolean;
  errorMsg: string | null;
  onSubmit: (e: SyntheticEvent) => void;
  onCancel: () => void;
  /** When true, Cancel/Save live in the parent drawer footer. */
  hideActions?: boolean;
}
