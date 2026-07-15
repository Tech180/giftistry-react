import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { SettingsTemplate } from './settings.html';

vi.mock('./components/settings-sidebar/settings-sidebar.component', () => ({
  SettingsSidebar: () => <nav aria-label="Settings">sidebar</nav>,
}));

vi.mock('./components/processes-rail/processes-rail.component', () => ({
  ProcessesRail: ({ scope }: { scope: string }) => (
    <aside aria-label="Background processes">
      <div>processes rail ({scope})</div>
    </aside>
  ),
}));

describe('SettingsTemplate processes rail', () => {
  test('renders background processes rail when scope is set', () => {
    render(
      <MemoryRouter>
        <SettingsTemplate
          routes={<div>main content</div>}
          toasts={[]}
          isAdmin={false}
          processesRailScope="mine"
          onProcessesError={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('complementary', { name: 'Background processes' })).toBeInTheDocument();
    expect(screen.getByText('processes rail (mine)')).toBeInTheDocument();
  });

  test('renders admin scope rail on overview', () => {
    render(
      <MemoryRouter>
        <SettingsTemplate
          routes={<div>overview</div>}
          toasts={[]}
          isAdmin
          processesRailScope="admin"
          onProcessesError={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('processes rail (admin)')).toBeInTheDocument();
  });

  test('hides processes rail when scope is null', () => {
    render(
      <MemoryRouter>
        <SettingsTemplate
          routes={<div>security</div>}
          toasts={[]}
          isAdmin={false}
          processesRailScope={null}
          onProcessesError={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.queryByRole('complementary', { name: 'Background processes' })).not.toBeInTheDocument();
  });
});
