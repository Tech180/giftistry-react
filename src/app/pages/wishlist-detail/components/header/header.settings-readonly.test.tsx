import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { Header } from './header.component';
import type { HeaderProps } from './interfaces/header-props.interface';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    canShowAi: false,
    canShowWebSearch: false,
    user: { Id: 'u1', Username: 'owner', FirstName: 'Owner' },
  }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../list-settings-panel/list-settings-panel.component', () => ({
  ListSettingsPanel: ({ readOnly }: { readOnly?: boolean }) => (
    <div data-testid="list-settings" data-read-only={String(!!readOnly)} />
  ),
}));

vi.mock('shared/utils/wishlist-export', () => ({
  exportToCsv: vi.fn(),
  exportToXlsx: vi.fn(),
  exportToTxt: vi.fn(),
  exportToJson: vi.fn(),
  exportToPdf: vi.fn(),
}));

const wishlist = {
  Id: 'list-1',
  UserId: 'u1',
  Title: 'Party List',
  ExpiresAt: null,
  AllowGroupFunds: false,
  IsActive: true,
  AiEnabled: false,
  WebSearchEnabled: false,
  ManualJobBackground: true,
  AutoRollover: false,
} as HeaderProps['wishlist'];

const baseProps: HeaderProps = {
  wishlist,
  items: [],
  priorities: [],
  isOwner: true,
  isExpired: false,
  isArchived: false,
  isDeactivating: false,
  isActivating: false,
  isDeleting: false,
  confirmAction: null,
  setConfirmAction: vi.fn(),
  handleDeactivateConfirm: vi.fn(),
  handleActivateConfirm: vi.fn(),
  handleDeleteConfirm: vi.fn(),
  saveTitle: vi.fn(async () => undefined),
  saveDate: vi.fn(async () => undefined),
  formatDate: () => '',
  toggleAiEnabled: vi.fn(),
  toggleWebSearchEnabled: vi.fn(),
  toggleManualJobBackground: vi.fn(),
  toggleAutoRollover: vi.fn(),
  isCommentsOpen: false,
  setIsCommentsOpen: vi.fn(),
  setIsShareOpen: vi.fn(),
  canImport: true,
  isImportOpen: false,
  onImportToggle: vi.fn(),
};

describe('Header list settings read-only', () => {
  test('owner on active list can edit settings', () => {
    render(
      <MemoryRouter>
        <Header {...baseProps} />
      </MemoryRouter>
    );

    const settingsBtn = screen.getByRole('button', { name: /list settings/i });
    expect(settingsBtn.className).not.toMatch(/action-pill-muted/);
    fireEvent.click(settingsBtn);
    expect(screen.getByTestId('list-settings')).toHaveAttribute('data-read-only', 'false');
  });

  test('owner on archived list sees muted read-only settings', () => {
    render(
      <MemoryRouter>
        <Header
          {...baseProps}
          isArchived
          wishlist={{ ...wishlist, IsActive: false }}
        />
      </MemoryRouter>
    );

    const settingsBtn = screen.getByRole('button', { name: /list settings/i });
    expect(settingsBtn.className).toMatch(/action-pill-muted/);
    fireEvent.click(settingsBtn);
    expect(screen.getByTestId('list-settings')).toHaveAttribute('data-read-only', 'true');
  });
});
