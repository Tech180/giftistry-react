import type { MouseEvent, RefObject, SubmitEvent } from 'react';

export interface TemplateProps {
  isInputMode: boolean;
  isMenuOpen: boolean;
  isExpanded: boolean;
  canAutoAdd: boolean;
  url: string;
  errorMsg: string | null;
  isSubmitting: boolean;
  hintText: string;
  menuToggleLabel: string;
  actionTabIndex: number;
  rootClassName: string;
  barClassName: string;
  urlInputRef: RefObject<HTMLInputElement | null>;
  widgetRef: RefObject<HTMLDivElement | null>;
  onUrlChange: (value: string) => void;
  onIconTriggerClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onAutoClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onManualClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onExitInputMode: () => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}
