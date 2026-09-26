import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TourProvider } from '../providers/provider';
import { useTourOptional } from '../providers/context';

const authState = vi.hoisted(() => ({
  experimental: undefined as Record<string, boolean> | undefined,
  firstRunDismissed: true,
}));

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
        Tour: { FirstRunDismissed: authState.firstRunDismissed, Chapters: {} },
        ExperimentalFeatures: authState.experimental,
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
    authState.experimental = undefined;
    authState.firstRunDismissed = true;
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

  test('does not auto-start when productTutorial experimental flag is off', async () => {
    authState.firstRunDismissed = false;
    authState.experimental = { ProductTutorial: false };

    render(
      <MemoryRouter>
        <TourProvider>
          <Probe />
        </TourProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('active').textContent).toBe('false');
  });

  test('does not auto-start when ExperimentalFeatures omits productTutorial (default off)', () => {
    authState.firstRunDismissed = false;
    authState.experimental = undefined;

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
