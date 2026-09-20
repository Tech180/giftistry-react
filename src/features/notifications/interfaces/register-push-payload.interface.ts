import type { PushSubscription } from './push-subscription.interface';
import type { PushTransport } from './push-transport.type';

export interface RegisterPushPayload {
  Platform: PushSubscription['Platform'];
  Transport: PushTransport;
  Endpoint?: string;
  Keys?: {
    P256dh?: string;
    Auth?: string;
  };
  IsPrimary?: boolean;
}
