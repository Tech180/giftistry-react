import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAuth } from 'features/auth';
import { FriendsProvider } from './provider';
import { useFriendsController } from './context';

const listFriends = vi.fn();
const listFriendRequests = vi.fn();

vi.mock('features/auth', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: true })),
}));

vi.mock('../api/friends.api', () => ({
  friendsApi: {
    listFriends: (...args: unknown[]) => listFriends(...args),
    listFriendRequests: (...args: unknown[]) => listFriendRequests(...args),
    sendRequest: vi.fn(),
    acceptRequest: vi.fn(),
    rejectRequest: vi.fn(),
    removeFriend: vi.fn(),
    searchUsers: vi.fn(),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <FriendsProvider>{children}</FriendsProvider>;
}

describe('FriendsProvider', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>);
    listFriends.mockReset();
    listFriendRequests.mockReset();
  });

  it('loads friends and requests on fetchFriends', async () => {
    listFriends.mockResolvedValue([
      {
        Id: 'f1',
        UserId: 'u1',
        Username: 'alice',
        FirstName: 'Alice',
        LastName: 'Smith',
        Email: 'a@example.com',
        Avatar: null,
      },
    ]);
    listFriendRequests.mockResolvedValue({
      Incoming: [{ Id: 'r1', SenderId: 'u2', ReceiverId: 'me', Status: 'pending' }],
      Outgoing: [],
    });

    const { result } = renderHook(() => useFriendsController(), { wrapper });

    await act(async () => {
      await result.current.fetchFriends();
    });

    await waitFor(() => {
      expect(result.current.friends).toHaveLength(1);
      expect(result.current.incomingRequests).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error when fetchFriends fails', async () => {
    listFriends.mockRejectedValue(new Error('network down'));
    listFriendRequests.mockResolvedValue({ Incoming: [], Outgoing: [] });

    const { result } = renderHook(() => useFriendsController(), { wrapper });

    await act(async () => {
      await result.current.fetchFriends();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('network down');
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('clears cache when unauthenticated', async () => {
    listFriends.mockResolvedValue([
      {
        Id: 'f1',
        UserId: 'u1',
        Username: 'alice',
        FirstName: 'Alice',
        LastName: 'Smith',
        Email: 'a@example.com',
        Avatar: null,
      },
    ]);
    listFriendRequests.mockResolvedValue({ Incoming: [], Outgoing: [] });

    const { result, rerender } = renderHook(() => useFriendsController(), { wrapper });

    await act(async () => {
      await result.current.fetchFriends();
    });

    await waitFor(() => {
      expect(result.current.friends).toHaveLength(1);
    });

    vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false } as ReturnType<typeof useAuth>);
    rerender();

    await waitFor(() => {
      expect(result.current.friends).toHaveLength(0);
      expect(result.current.error).toBeNull();
    });
  });

  it('throws when used outside FriendsProvider', () => {
    expect(() => renderHook(() => useFriendsController())).toThrow(
      'useFriendsController must be used within a FriendsProvider',
    );
  });
});
