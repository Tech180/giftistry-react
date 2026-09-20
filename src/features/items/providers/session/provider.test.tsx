import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuth } from 'features/auth';
import { ItemsSessionProvider } from './provider';
import { useItemsSession } from './context';

vi.mock('features/auth', () => ({
  useAuth: vi.fn(() => ({
    user: { Id: 'u1', Username: 'alice' },
    canShowAi: true,
  })),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <ItemsSessionProvider>{children}</ItemsSessionProvider>;
}

describe('ItemsSessionProvider', () => {
  it('exposes user and canShowAi from auth', () => {
    const { result } = renderHook(() => useItemsSession(), { wrapper });

    expect(result.current.user?.Id).toBe('u1');
    expect(result.current.canShowAi).toBe(true);
  });

  it('throws when used outside ItemsSessionProvider', () => {
    expect(() => renderHook(() => useItemsSession())).toThrow(
      'useItemsSession must be used within an ItemsSessionProvider',
    );
  });

  it('updates when auth values change', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      canShowAi: false,
    } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useItemsSession(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.canShowAi).toBe(false);
  });
});
