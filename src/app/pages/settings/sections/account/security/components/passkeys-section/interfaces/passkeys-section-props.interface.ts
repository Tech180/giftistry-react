import type { Passkey } from './passkey.interface';

export interface PasskeysSectionProps {
  handleRegisterPasskey: () => Promise<void>;
  passkeys: Passkey[];
  handleDeletePasskey: (id: string) => Promise<void>;
  deletingPasskeyId: string | null;
  setDeletingPasskeyId: (id: string | null) => void;
}
