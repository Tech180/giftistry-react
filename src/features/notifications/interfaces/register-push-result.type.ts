import type { PushSubscription } from './push-subscription.interface';

export type RegisterPushResult =
  | {
      SubscriptionId: string;
      Topic: string;
      AccessToken: string;
    }
  | PushSubscription;
