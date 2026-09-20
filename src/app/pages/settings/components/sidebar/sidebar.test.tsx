import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { SidebarTemplate } from './sidebar.html';

vi.mock('shared/ui', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
  SidebarItem: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  ),
}));

describe('SidebarTemplate Server nav', () => {
  test('hides Server for admin who is not owner', () => {
    render(
      <MemoryRouter>
        <SidebarTemplate
          isAdmin
          isOwner={false}
          activePath="/settings/admin"
          onNavigate={vi.fn()}
          isCollapsed={false}
          panelId="sidebar-panel"
          onToggleCollapsed={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Users' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Server' })).not.toBeInTheDocument();
  });

  test('shows Server for owner admin', () => {
    render(
      <MemoryRouter>
        <SidebarTemplate
          isAdmin
          isOwner
          activePath="/settings/admin/server"
          onNavigate={vi.fn()}
          isCollapsed={false}
          panelId="sidebar-panel"
          onToggleCollapsed={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Server' })).toBeInTheDocument();
  });
});
