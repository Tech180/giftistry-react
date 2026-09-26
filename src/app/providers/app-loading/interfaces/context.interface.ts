export interface ContextValue {
  message: string | null;
  show: (message: string, id?: string) => void;
  clear: (id?: string) => void;
}
