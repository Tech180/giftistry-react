import type { Notification } from '../interfaces/notification.interface';

/** Raw notification shape from REST or WebSocket (backend uses ReadAt). */
export type NotificationPayload = {
  Id: string;
  UserId: string;
  Type: string;
  Title: string;
  Message?: string | null;
  ReadAt?: string | Date | null;
  IsRead?: boolean;
  CreatedAt: string | Date;
  Metadata?: Record<string, unknown>;
};

function stringifyMetadata(metadata?: Record<string, unknown>): Record<string, string> | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined || value === null) continue;
    result[key] = typeof value === 'string' ? value : String(value);
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function toIsoString(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  return value;
}

/**
 * Normalize API / WebSocket notification payloads into the frontend Notification shape.
 */
export function mapNotification(payload: NotificationPayload): Notification {
  const isRead =
    typeof payload.IsRead === 'boolean' ? payload.IsRead : !!payload.ReadAt;

  return {
    Id: payload.Id,
    UserId: payload.UserId,
    Type: payload.Type as Notification['Type'],
    Title: payload.Title,
    Message: payload.Message ?? '',
    IsRead: isRead,
    CreatedAt: toIsoString(payload.CreatedAt),
    Metadata: stringifyMetadata(payload.Metadata),
  };
}
