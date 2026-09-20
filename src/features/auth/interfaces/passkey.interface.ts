export interface Passkey {
  Id: string;
  CredentialId?: string;
  Name?: string;
  CreatedAt?: string;
  LastUsedAt?: string | null;
  BackedUp?: boolean;
  Transports?: string[];
}
