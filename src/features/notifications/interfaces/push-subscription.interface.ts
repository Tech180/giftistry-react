import type { PushTransport } from './push-transport.type';

export interface PushSubscription {
  Id: string;
  Platform: 'ios' | 'android';
  Transport: PushTransport;
  IsPrimary: boolean;
  CreatedAt: string;
  LastSeenAt?: string;
}
