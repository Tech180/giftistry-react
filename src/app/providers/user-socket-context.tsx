import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { getUserWsUrl } from 'features/comments/utils/comment-ws.util';

interface UserSocketContextType {
  isConnected: boolean;
  addEventListener: (type: string, callback: (data: any) => void) => void;
  removeEventListener: (type: string, callback: (data: any) => void) => void;
}

const UserSocketContext = createContext<UserSocketContextType | undefined>(undefined);

export function UserSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Record<string, Set<(data: any) => void>>>({});
  const reconnectTimeoutRef = useRef<any>(null);

  const addEventListener = (type: string, callback: (data: any) => void) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = new Set();
    }
    listenersRef.current[type].add(callback);
  };

  const removeEventListener = (type: string, callback: (data: any) => void) => {
    if (listenersRef.current[type]) {
      listenersRef.current[type].delete(callback);
      if (listenersRef.current[type].size === 0) {
        delete listenersRef.current[type];
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    let isCleanup = false;

    const connect = () => {
      if (socketRef.current || isCleanup) return;

      try {
        const wsUrl = getUserWsUrl();
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          if (isCleanup) {
            socket.close();
            return;
          }
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.Type) {
              const callbacks = listenersRef.current[data.Type];
              if (callbacks) {
                callbacks.forEach((cb) => cb(data));
              }
            }
          } catch (err) {
            console.error('Error parsing user socket message:', err);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          socketRef.current = null;
          if (!isCleanup) {
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
          }
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch (err) {
        console.error('Error establishing user websocket connection:', err);
        if (!isCleanup) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      }
    };

    connect();

    return () => {
      isCleanup = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  return (
    <UserSocketContext.Provider value={{ isConnected, addEventListener, removeEventListener }}>
      {children}
    </UserSocketContext.Provider>
  );
}

export function useUserSocket() {
  const context = useContext(UserSocketContext);
  if (context === undefined) {
    throw new Error('useUserSocket must be used within a UserSocketProvider');
  }
  return context;
}
