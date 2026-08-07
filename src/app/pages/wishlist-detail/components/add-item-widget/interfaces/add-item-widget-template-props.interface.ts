import type { FormEvent, RefObject } from 'react';

export interface AddItemWidgetTemplateProps {
  isInputMode: boolean;
  isMenuOpen: boolean;
  url: string;
  setUrl: (value: string) => void;
  errorMsg: string | null;
  isSubmitting: boolean;
  urlInputRef: RefObject<HTMLInputElement | null>;
  widgetRef: RefObject<HTMLDivElement | null>;
  onToggleMenu: () => void;
  onEnterInputMode: () => void;
  onExitInputMode: () => void;
  onManual: () => void;
  handleSubmit: (event: FormEvent) => void;
}
