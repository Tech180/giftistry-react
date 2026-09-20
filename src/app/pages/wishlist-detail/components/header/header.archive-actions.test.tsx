import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { HeaderTemplate } from './header.html';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './header.module.css';

vi.mock('features/auth', () => ({
  useAuth: () => ({
    canShowAi: false,
    canShowWebSearch: false,
    user: { Id: 'u1', Username: 'owner' },
  }),
  UserPreviewCard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('app/providers/theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../settings-panel/settings-panel.component', () => ({
  SettingsPanel: () => null,
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
} as TemplateProps['wishlist'];

const baseProps: TemplateProps = {
  wishlist,
  items: [],
  priorities: [],
  isOwner: true,
  onGoHome: vi.fn(),
  isExpired: false,
  isArchived: false,
  isDeactivating: false,
  isActivating: false,
  isDeleting: false,
  confirmAction: null,
  confirmMessage: '',
  confirmBannerClassName: styles['header__confirm-banner'],
  confirmYesBtnClassName: `${styles['header__confirm-btn']} ${styles['header__yes-btn']}`,
  onConfirmYes: vi.fn(),
  onConfirmNo: vi.fn(),
  formatDate: () => '',
  toggleAiEnabled: vi.fn(),
  toggleWebSearchEnabled: vi.fn(),
  toggleManualJobBackground: vi.fn(),
  toggleAutoRollover: vi.fn(),
  toggleAllowGroupFunds: vi.fn(),
  canShowAi: false,
  canShowWebSearch: false,
  isCommentsOpen: false,
  canImport: true,
  isImportOpen: false,
  onImportToggle: vi.fn(),
  isDuplicating: false,
  duplicateLabel: 'Duplicate',
  isEditingTitle: false,
  tempTitle: 'Party List',
  onTitleChange: vi.fn(),
  onTitleBlur: vi.fn(),
  onTitleKeyDown: vi.fn(),
  onStartEditTitle: vi.fn(),
  isEditingDate: false,
  tempDate: '',
  onDateChange: vi.fn(),
  onStartEditDate: vi.fn(),
  isExportDropdownOpen: false,
  exportRef: { current: null },
  isListSettingsOpen: false,
  listSettingsRef: { current: null },
  showListSettings: false,
  listSettingsReadOnly: false,
  listSettingsPillClassName: styles['header__action-pill'],
  showOwnerBadgeRegion: false,
  ownerBadgeClassName: styles['header__owner-badge'],
  ownerDisplayName: 'Owner',
  backLinkLabel: 'Back to Dashboard',
  actionsBusy: false,
  importPillClassName: styles['header__action-pill'],
  onOpenShare: vi.fn(),
  onToggleComments: vi.fn(),
  onToggleListSettings: vi.fn(),
  onToggleExport: vi.fn(),
  onRequestActivate: vi.fn(),
  onRequestDeactivate: vi.fn(),
  onRequestDelete: vi.fn(),
  onRequestDuplicate: vi.fn(),
  onExportCsv: vi.fn(),
  onExportXlsx: vi.fn(),
  onExportTxt: vi.fn(),
  onExportJson: vi.fn(),
  onExportPdf: vi.fn(),
};

function renderHeader(overrides: Partial<TemplateProps> = {}) {
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
    renderHeader({
      isPublicGuest: true,
      isOwner: false,
      canImport: false,
      showOwnerBadgeRegion: true,
      backLinkLabel: 'Log in',
    });
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back to dashboard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /discussion/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /share registry/i })).not.toBeInTheDocument();
  });

  test('authenticated non-owner owner badge can hide on mobile FAB breakpoint', () => {
    const { container } = renderHeader({
      isOwner: false,
      showOwnerBadgeRegion: true,
      ownerBadgeClassName: `${styles['header__owner-badge']} ${styles['header__owner-badge--hide-mobile']}`,
      ownerDisplayName: 'Ada',
      wishlist: {
        ...wishlist,
        UserId: 'owner-2',
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
    });

    const badgeRegion = container.querySelector('[class*="owner-badge--hide-mobile"]');
    expect(badgeRegion).not.toBeNull();
    expect(screen.getAllByLabelText('Owner: Ada').length).toBeGreaterThan(0);
  });

  test('public guest owner badge stays visible without mobile hide class', () => {
    const { container } = renderHeader({
      isPublicGuest: true,
      isOwner: false,
      canImport: false,
      showOwnerBadgeRegion: true,
      ownerBadgeClassName: styles['header__owner-badge'],
      ownerDisplayName: 'Ada',
      backLinkLabel: 'Log in',
      wishlist: {
        ...wishlist,
        UserId: 'owner-2',
        OwnerFirstName: 'Ada',
        OwnerUsername: 'ada',
      },
    });

    expect(container.querySelector('[class*="owner-badge--hide-mobile"]')).toBeNull();
    expect(screen.getAllByLabelText('Owner: Ada').length).toBeGreaterThan(0);
  });
});
