import type { NotificationType } from './notification-type.type';

export interface Notification {
  Id: string;
  UserId: string;
  Type: NotificationType;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  Metadata?: Record<string, string>;
}
