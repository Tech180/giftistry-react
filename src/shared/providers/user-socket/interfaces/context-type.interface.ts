export type UserSocketEventCallback = (data: unknown) => void;

export interface UserSocketContextType {
  isConnected: boolean;
  addEventListener: (type: string, callback: UserSocketEventCallback) => void;
  removeEventListener: (type: string, callback: UserSocketEventCallback) => void;
}
