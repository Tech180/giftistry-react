import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AudiencePickerTemplate } from './audience-picker.html';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';

vi.mock('features/auth', () => ({
  UserPreviewCard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const baseProps = {
  visibilityMode: 'everyone' as const,
  search: '',
  setSearch: vi.fn(),
  onVisibilityModeChange: vi.fn(),
  onToggleUser: vi.fn(),
  selectedUserIds: [] as string[],
  disabled: false,
  getDisplayName: (share: ListShare) => share.Username ?? share.UserId,
  getInitials: () => 'AB',
  filteredShares: [] as ListShare[],
};

describe('AudiencePickerTemplate', () => {
  test('solo list shows Everyone and Only Me only', () => {
    render(<AudiencePickerTemplate {...baseProps} listShares={[]} />);

    expect(screen.getByRole('button', { name: 'Everyone' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Only Me' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Specific People' })).not.toBeInTheDocument();
  });

  test('shared list shows all three visibility segments', () => {
    const listShares: ListShare[] = [
      {
        Id: 'share-1',
        ListId: 'list-1',
        UserId: 'user-1',
        Role: 'collaborator',
        Username: 'collab',
      },
    ];

    render(
      <AudiencePickerTemplate
        {...baseProps}
        listShares={listShares}
        filteredShares={listShares}
      />
    );

    expect(screen.getByRole('button', { name: 'Everyone' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Specific People' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Only Me' })).toBeInTheDocument();
  });
});
