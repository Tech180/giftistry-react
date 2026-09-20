import type { AiCapabilities } from './ai-capabilities.interface';
import type { User } from './user.interface';

export interface GetAiCapabilityFlagsOptions {
  globalAiEnabled: boolean;
  globalWebSearchEnabled: boolean;
  user: User | null;
  capabilities: AiCapabilities | undefined;
}
