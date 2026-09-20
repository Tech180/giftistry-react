import type { AiModelSlot } from './ai-model-slot.type';

export interface AiCheckPayload {
  AiProvider: string;
  AiEndpoint?: string | null;
  AiApiKey?: string | null;
  AiModelSlot?: AiModelSlot;
  AiFastModel?: string | null;
  AiIntelligentModel?: string | null;
}
