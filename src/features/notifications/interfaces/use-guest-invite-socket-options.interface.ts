export interface UseGuestInviteSocketOptions {
  enabled: boolean;
  token: string | undefined;
  /** Password for protected links; omit/null for open links. */
  password: string | null;
  onListChanged: () => void;
  onRevoked: () => void;
  reconnectMs?: number;
  reconnectErrorMs?: number;
}
