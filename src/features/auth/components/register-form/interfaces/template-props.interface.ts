import type { ReactNode, SyntheticEvent } from 'react';

export interface TemplateProps {
  inviteValidating: boolean;
  registrationClosed: boolean;
  registrationClosedMessage?: string;
  localError: string | null;
  handleSubmit: (e: SyntheticEvent) => void;
  fields: ReactNode;
  actions: ReactNode;
}
