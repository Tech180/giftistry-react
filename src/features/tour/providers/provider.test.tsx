import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TourProvider } from '../providers/provider';
import { useTourOptional } from '../providers/context';

vi.mock('features/auth', async () => {
  const actual = await vi.importActual<typeof import('features/auth')>('features/auth');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        Id: 'u1',
        Username: 'alex',
        FirstName: 'Alex',
        IsOnboarded: true,
        Tour: { FirstRunDismissed: true, Chapters: {} },
      },
      refreshUser: vi.fn(),
      canShowAi: true,
      isAuthenticated: true,
    }),
    authApi: {
      patchTutorial: vi.fn().mockResolvedValue({
        Tour: { FirstRunDismissed: false, Chapters: {} },
        User: {},
      }),
    },
  };
});

function Probe() {
  const tour = useTourOptional();
  return <div data-testid="active">{String(Boolean(tour?.isActive))}</div>;
}

describe('TourProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders children and exposes inactive tour when first-run dismissed', () => {
    render(
      <MemoryRouter>
        <TourProvider>
          <Probe />
        </TourProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('active').textContent).toBe('false');
  });
});
