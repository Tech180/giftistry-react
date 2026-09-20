import React from 'react';
import { render, screen } from '@testing-library/react';
import { OwnerBadge } from './owner-badge.component';

vi.mock('features/auth', () => ({
  useAuth: () => ({ user: { Id: 'test-user-id' } }),
  UserPreviewCard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('app/providers/theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('OwnerBadge', () => {
  it('renders owner box with avatar initials', () => {
    render(
      <OwnerBadge
        userId="owner-1"
        displayName="Jamie Lee"
        firstName="Jamie"
        username="jamie"
      />
    );

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Owner: Jamie Lee')[0]).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});
