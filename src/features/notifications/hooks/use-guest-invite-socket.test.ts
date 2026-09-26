import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useGuestInviteSocket } from './use-guest-invite-socket';

const getInvitePreviewWsUrlMock = vi.fn((token: string) => `ws://test/ws/invite/${token}`);

vi.mock('../utils/get-invite-preview-ws-url.util', () => ({
  getInvitePreviewWsUrl: (token: string) => getInvitePreviewWsUrlMock(token),
}));

class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static OPEN = 1;
  static CONNECTING = 0;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen: ((ev: Event) => void) | null = null;
  onclose: ((ev: CloseEvent) => void) | null = null;
  onerror: ((ev: Event) => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  sent: string[] = [];

  constructor(public url: string) {
    MockWebSocket.instances.push(this);
    queueMicrotask(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.(new Event('open'));
    });
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close'));
  }

  emit(data: unknown) {
    this.onmessage?.(
      new MessageEvent('message', { data: JSON.stringify(data) })
    );
  }
}

describe('useGuestInviteSocket', () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('sends auth when password is provided and reloads on list.changed', async () => {
    const onListChanged = vi.fn();
    const onRevoked = vi.fn();

    renderHook(() =>
      useGuestInviteSocket({
        enabled: true,
        token: 'tok-1',
        password: 'secret',
        onListChanged,
        onRevoked,
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    const socket = MockWebSocket.instances[0];
    expect(socket).toBeDefined();
    expect(getInvitePreviewWsUrlMock).toHaveBeenCalledWith('tok-1');
    expect(socket.sent).toEqual([JSON.stringify({ Type: 'auth', Password: 'secret' })]);

    await act(async () => {
      socket.emit({ Type: 'list.changed', Reason: 'item.updated' });
    });
    expect(onListChanged).toHaveBeenCalledTimes(1);
  });

  test('invite.revoked calls onRevoked', async () => {
    const onListChanged = vi.fn();
    const onRevoked = vi.fn();

    renderHook(() =>
      useGuestInviteSocket({
        enabled: true,
        token: 'tok-2',
        password: null,
        onListChanged,
        onRevoked,
      })
    );

    await act(async () => {
      await Promise.resolve();
    });

    const socket = MockWebSocket.instances[0];
    await act(async () => {
      socket.emit({ Type: 'invite.revoked' });
    });
    expect(onRevoked).toHaveBeenCalledTimes(1);
  });

  test('does not connect when disabled', () => {
    renderHook(() =>
      useGuestInviteSocket({
        enabled: false,
        token: 'tok-3',
        password: null,
        onListChanged: vi.fn(),
        onRevoked: vi.fn(),
      })
    );
    expect(MockWebSocket.instances).toHaveLength(0);
  });
});
