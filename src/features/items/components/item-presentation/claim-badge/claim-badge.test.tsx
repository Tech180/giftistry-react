import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClaimBadge } from './claim-badge.html';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'test-user-id' } }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('ClaimBadge', () => {
  it('renders claimer initials with profile card trigger', () => {
    render(
      <ClaimBadge
        userId="user-1"
        displayName="Jamie Lee"
        claimedByCurrentUser={false}
      />
    );

    expect(screen.getAllByLabelText('Claimed by Jamie Lee')[0]).toBeInTheDocument();
    expect(screen.getByText('Claimed by')).toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
  });

  it('uses you-claimed label for current user', () => {
    render(
      <ClaimBadge
        userId="user-1"
        displayName="Jamie Lee"
        claimedByCurrentUser
      />
    );

    expect(screen.getAllByLabelText('You claimed this')[0]).toBeInTheDocument();
    expect(screen.getByText('Claimed by')).toBeInTheDocument();
  });

  it('shows anonymous label instead of avatar for anonymous claims', () => {
    render(
      <ClaimBadge
        displayName="Anonymous"
        anonymous
        claimedByCurrentUser
      />
    );

    expect(screen.getAllByLabelText('You claimed this anonymously')[0]).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows anonymous label for other users anonymous claims', () => {
    render(<ClaimBadge displayName="Anonymous" anonymous />);

    expect(screen.getAllByLabelText('Claimed anonymously')[0]).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });
});
