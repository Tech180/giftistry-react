import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import {
  MobilePageActionsProvider,
  MobilePageActionsHost,
  useMobilePageActions,
  useRegisterPageActions,
} from 'app/providers/mobile-page-actions-context';
import type { FloatingAction } from 'shared/ui';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: { Id: 'u1', Username: 'tester' },
  }),
}));

function RegisterActions({ actions }: { actions: FloatingAction[] }) {
  useRegisterPageActions(actions);
  return null;
}

function PageActionsProbe() {
  const { pageActions } = useMobilePageActions();
  return <div data-testid="page-action-ids">{pageActions.map((a) => a.id).join(',')}</div>;
}

describe('MobilePageActions registry', () => {
  test('useRegisterPageActions sets actions and clears them on unmount', () => {
    const actions: FloatingAction[] = [
      {
        id: 'import',
        label: 'Import',
        icon: <span>I</span>,
        onClick: vi.fn(),
      },
    ];

    const { rerender } = render(
      <MemoryRouter>
        <MobilePageActionsProvider>
          <RegisterActions actions={actions} />
          <PageActionsProbe />
          <MobilePageActionsHost />
        </MobilePageActionsProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-action-ids')).toHaveTextContent('import');
    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    expect(screen.getByRole('menuitem', { name: /import/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /settings/i })).toBeNull();

    rerender(
      <MemoryRouter>
        <MobilePageActionsProvider>
          <PageActionsProbe />
          <MobilePageActionsHost />
        </MobilePageActionsProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('page-action-ids')).toHaveTextContent('');
  });

  test('clears registered actions when the registering component unmounts', () => {
    const actions: FloatingAction[] = [
      {
        id: 'import',
        label: 'Import',
        icon: <span>I</span>,
        onClick: vi.fn(),
      },
    ];

    function Harness({ showRegister }: { showRegister: boolean }) {
      return (
        <MemoryRouter>
          <MobilePageActionsProvider>
            {showRegister ? <RegisterActions actions={actions} /> : null}
            <PageActionsProbe />
          </MobilePageActionsProvider>
        </MemoryRouter>
      );
    }

    const { rerender } = render(<Harness showRegister />);
    expect(screen.getByTestId('page-action-ids')).toHaveTextContent('import');

    rerender(<Harness showRegister={false} />);
    expect(screen.getByTestId('page-action-ids')).toHaveTextContent('');
  });
});
