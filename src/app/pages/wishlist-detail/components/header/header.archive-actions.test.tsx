import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { HeaderTemplate } from './header.html';
import type { HeaderTemplateProps } from './interfaces/header-template-props.interface';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    canShowAi: false,
    canShowWebSearch: false,
    user: { Id: 'u1', Username: 'owner' },
  }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../list-settings-panel/list-settings-panel.component', () => ({
  ListSettingsPanel: () => null,
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
} as HeaderTemplateProps['wishlist'];

const baseProps: HeaderTemplateProps = {
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
  toggleAllowGroupFunds: vi.fn(),
  canShowAi: false,
  canShowWebSearch: false,
  isCommentsOpen: false,
  setIsCommentsOpen: vi.fn(),
  setIsShareOpen: vi.fn(),
  canImport: true,
  isImportOpen: false,
  onImportToggle: vi.fn(),
  onDuplicate: vi.fn(),
  isDuplicating: false,
  isEditingTitle: false,
  setIsEditingTitle: vi.fn(),
  tempTitle: 'Party List',
  setTempTitle: vi.fn(),
  isEditingDate: false,
  setIsEditingDate: vi.fn(),
  tempDate: '',
  setTempDate: vi.fn(),
  isExportDropdownOpen: false,
  setIsExportDropdownOpen: vi.fn(),
  exportRef: { current: null },
  isListSettingsOpen: false,
  setIsListSettingsOpen: vi.fn(),
  listSettingsRef: { current: null },
  exportContext: { exporterName: 'Owner', isOwner: true, currentUserId: 'u1' },
  showListSettings: false,
  listSettingsReadOnly: false,
  showOwnerBadgeRegion: false,
};

function renderHeader(overrides: Partial<HeaderTemplateProps> = {}) {
  return render(
    <MemoryRouter>
      <HeaderTemplate {...baseProps} {...overrides} />
    </MemoryRouter>
  );
}

describe('HeaderTemplate archive actions', () => {
  test('active list shows archive only', () => {
    renderHeader({ isArchived: false });
    expect(screen.getByLabelText('Deactivate / Archive Wishlist')).toBeInTheDocument();
    expect(screen.queryByLabelText('Delete Wishlist and Items')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Restore Wishlist from Archive')).not.toBeInTheDocument();
  });

  test('archived list shows restore and delete', () => {
    renderHeader({ isArchived: true, wishlist: { ...wishlist, IsActive: false } });
    expect(screen.queryByLabelText('Deactivate / Archive Wishlist')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Restore Wishlist from Archive')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete Wishlist and Items')).toBeInTheDocument();
  });

  test('does not show reveal after expiration chip', () => {
    renderHeader();
    expect(screen.queryByText('Reveal after expiration')).not.toBeInTheDocument();
    expect(screen.queryByText('Hide suggestions permanently')).not.toBeInTheDocument();
  });

  test('public guest header hides discuss, export, and dashboard link', () => {
    renderHeader({ isPublicGuest: true, isOwner: false, canImport: false, showOwnerBadgeRegion: true });
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /back to dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /discussion/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /share registry/i })).not.toBeInTheDocument();
  });

  test('authenticated non-owner owner badge can hide on mobile FAB breakpoint', () => {
    const { container } = renderHeader({
      isOwner: false,
      showOwnerBadgeRegion: true,
      hideOwnerBadgeOnMobile: true,
      wishlist: {
        ...wishlist,
        UserId: 'owner-2',
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
    });

    const badgeRegion = container.querySelector('[class*="hideOwnerBadgeOnMobile"]');
    expect(badgeRegion).not.toBeNull();
    expect(screen.getAllByLabelText('Owner: Ada').length).toBeGreaterThan(0);
  });

  test('public guest owner badge stays visible without mobile hide class', () => {
    const { container } = renderHeader({
      isPublicGuest: true,
      isOwner: false,
      canImport: false,
      showOwnerBadgeRegion: true,
      hideOwnerBadgeOnMobile: false,
      wishlist: {
        ...wishlist,
        UserId: 'owner-2',
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
    });

    expect(container.querySelector('[class*="hideOwnerBadgeOnMobile"]')).toBeNull();
    expect(screen.getAllByLabelText('Owner: Ada').length).toBeGreaterThan(0);
  });
});
