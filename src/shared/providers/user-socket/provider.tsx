import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  USER_SOCKET_RECONNECT_ERROR_MS,
  USER_SOCKET_RECONNECT_MS,
} from './constants/reconnect.constant';
import { UserSocketContext } from './context';
import type { UserSocketEventCallback } from './interfaces/context-type.interface';
import type { ProviderProps } from './interfaces/provider-props.interface';
import { getUserWsUrl } from './utils/get-ws-url.util';

function getSocketEventType(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const type = (data as { Type?: unknown }).Type;
  return typeof type === 'string' ? type : null;
}

export function UserSocketProvider({
  children,
  isAuthenticated,
  userId,
}: ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Record<string, Set<UserSocketEventCallback>>>({});
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addEventListener = useCallback((type: string, callback: UserSocketEventCallback) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = new Set();
    }
    listenersRef.current[type].add(callback);
  }, []);

  const removeEventListener = useCallback((type: string, callback: UserSocketEventCallback) => {
    if (listenersRef.current[type]) {
      listenersRef.current[type].delete(callback);
      if (listenersRef.current[type].size === 0) {
        delete listenersRef.current[type];
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    let isCleanup = false;

    const connect = () => {
      if (socketRef.current || isCleanup) {
        return;
      }

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
            const data: unknown = JSON.parse(event.data);
            const type = getSocketEventType(data);
            if (!type) {
              return;
            }

            const callbacks = listenersRef.current[type];
            if (callbacks) {
              callbacks.forEach((cb) => cb(data));
            }
          } catch (err) {
            console.error('Error parsing user socket message:', err);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          socketRef.current = null;
          if (!isCleanup) {
            reconnectTimeoutRef.current = setTimeout(connect, USER_SOCKET_RECONNECT_MS);
          }
        };

        socket.onerror = () => {
          socket.close();
        };
      } catch (err) {
        console.error('Error establishing user websocket connection:', err);
        if (!isCleanup) {
          reconnectTimeoutRef.current = setTimeout(connect, USER_SOCKET_RECONNECT_ERROR_MS);
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
  }, [isAuthenticated, userId]);

  const value = useMemo(
    () => ({ isConnected, addEventListener, removeEventListener }),
    [isConnected, addEventListener, removeEventListener],
  );

  return (
    <UserSocketContext.Provider
      value = {
        value
      }
    >
      {children}
    </UserSocketContext.Provider>
  );
}
