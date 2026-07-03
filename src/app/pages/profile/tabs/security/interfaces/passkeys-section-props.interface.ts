import React from 'react';

export interface PasskeysSectionProps {
  handleRegisterPasskey: () => Promise<void>;
  passkeys: any[];
  handleDeletePasskey: (id: string) => Promise<void>;
  deletingPasskeyId: string | null;
  setDeletingPasskeyId: (id: string | null) => void;
}
