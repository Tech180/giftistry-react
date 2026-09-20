export interface AiCheckResult {
  Reachable: boolean;
  ModelAvailable: boolean | null;
  Working: boolean;
  Message: string;
  Models?: string[];
}
