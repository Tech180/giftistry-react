export interface TimeoutsProps {
  aiEnabled: boolean;
  aiConnectTimeoutMs: number;
  setAiConnectTimeoutMs: (value: number) => void;
  aiCompletionTimeoutMs: number;
  setAiCompletionTimeoutMs: (value: number) => void;
}
