import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClaimBadge } from './claim-badge.html';
import type { ClaimBadgeEntry } from '../../../interfaces/claim-badge-entry.interface';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'test-user-id' } }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

const jamie: ClaimBadgeEntry = {
  key: 'user-1',
  userId: 'user-1',
  displayName: 'Jamie Lee',
  anonymous: false,
};

const alex: ClaimBadgeEntry = {
  key: 'user-2',
  userId: 'user-2',
  displayName: 'Alex Kim',
  anonymous: false,
};

const anonymous: ClaimBadgeEntry = {
  key: 'anonymous',
  userId: null,
  displayName: 'Anonymous',
  anonymous: true,
};

describe('ClaimBadge', () => {
  it('renders a single claimer with initials', () => {
    render(<ClaimBadge entries={[jamie]} />);

    expect(screen.getAllByLabelText('Claimed by Jamie Lee')[0]).toBeInTheDocument();
    expect(screen.getByText('Claimed by')).toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
  });

  it('stacks two named avatars', () => {
    render(<ClaimBadge entries={[jamie, alex]} />);

    expect(
      screen.getAllByLabelText('Claimed by Jamie Lee and Alex Kim')[0]
    ).toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
    expect(screen.getByText('AK')).toBeInTheDocument();
  });

  it('shows consolidated anonymous label', () => {
    render(<ClaimBadge entries={[anonymous]} />);

    expect(screen.getAllByLabelText('Claimed by Anonymous')[0]).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  it('shows named avatars plus anonymous chip', () => {
    render(<ClaimBadge entries={[jamie, anonymous]} />);

    expect(
      screen.getAllByLabelText('Claimed by Jamie Lee and Anonymous')[0]
    ).toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  it('shows an a marker on the current user anonymous avatar', () => {
    render(
      <ClaimBadge
        entries={[{ ...jamie, anonymousMarker: true }, alex]}
      />
    );

    expect(
      screen.getAllByLabelText('Claimed by Jamie Lee (anonymous) and Alex Kim')[0]
    ).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.queryByText('Anonymous')).not.toBeInTheDocument();
  });

  it('shows overflow count when more than four named claimants', () => {
    const entries: ClaimBadgeEntry[] = [
      jamie,
      alex,
      { key: 'user-3', userId: 'user-3', displayName: 'Sam Lee', anonymous: false },
      { key: 'user-4', userId: 'user-4', displayName: 'Pat Ray', anonymous: false },
      { key: 'user-5', userId: 'user-5', displayName: 'Chris Day', anonymous: false },
      { key: 'user-6', userId: 'user-6', displayName: 'Riley Fox', anonymous: false },
    ];

    render(<ClaimBadge entries={entries} />);

    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
