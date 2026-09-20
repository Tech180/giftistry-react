/** Raw notification shape from REST or WebSocket (backend uses ReadAt). */
export interface NotificationPayload {
  Id: string;
  UserId: string;
  Type: string;
  Title: string;
  Message?: string | null;
  ReadAt?: string | Date | null;
  IsRead?: boolean;
  CreatedAt: string | Date;
  Metadata?: Record<string, unknown>;
}
