import { useEffect, useRef } from 'react';
import type { UseGuestInviteSocketOptions } from '../interfaces/use-guest-invite-socket-options.interface';
import { getInvitePreviewWsUrl } from '../utils/get-invite-preview-ws-url.util';

const DEFAULT_RECONNECT_MS = 3000;
const DEFAULT_RECONNECT_ERROR_MS = 5000;

export function useGuestInviteSocket({
  enabled,
  token,
  password,
  onListChanged,
  onRevoked,
  reconnectMs = DEFAULT_RECONNECT_MS,
  reconnectErrorMs = DEFAULT_RECONNECT_ERROR_MS,
}: UseGuestInviteSocketOptions): void {
  const onListChangedRef = useRef(onListChanged);
  onListChangedRef.current = onListChanged;
  const onRevokedRef = useRef(onRevoked);
  onRevokedRef.current = onRevoked;
  const passwordRef = useRef(password);
  passwordRef.current = password;

  useEffect(() => {
    if (!enabled || !token) {
      return;
    }

    let isCleanup = false;
    const socketRef: { current: WebSocket | null } = { current: null };
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (socketRef.current || isCleanup) {
        return;
      }
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      try {
        const socket = new WebSocket(getInvitePreviewWsUrl(token));
        socketRef.current = socket;

        socket.onopen = () => {
          const pw = passwordRef.current;
          if (pw) {
            socket.send(JSON.stringify({ Type: 'auth', Password: pw }));
          }
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(String(event.data)) as {
              Type?: string;
            };
            if (data.Type === 'list.changed') {
              onListChangedRef.current();
              return;
            }
            if (data.Type === 'invite.revoked') {
              onRevokedRef.current();
              isCleanup = true;
              socket.close();
              return;
            }
            if (data.Type === 'auth.failed') {
              onRevokedRef.current();
              isCleanup = true;
              socket.close();
            }
          } catch {
            /* ignore malformed frames */
          }
        };

        socket.onclose = () => {
          socketRef.current = null;
          if (!isCleanup) {
            reconnectTimeout = setTimeout(connect, reconnectMs);
          }
        };

        socket.onerror = () => {
          /* onclose handles retry */
        };
      } catch {
        if (!isCleanup) {
          reconnectTimeout = setTimeout(connect, reconnectErrorMs);
        }
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !socketRef.current && !isCleanup) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    connect();

    return () => {
      isCleanup = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socketRef.current) {
        const socket = socketRef.current;
        socket.onopen = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
        socketRef.current = null;
      }
    };
  }, [enabled, token, reconnectMs, reconnectErrorMs]);
}
