import React from 'react';
import { render, screen } from '@testing-library/react';
import { SharingAvatars } from './sharing-avatars.html';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'user-1' } }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

describe('SharingAvatars', () => {
  it('renders nothing when there are no shared users', () => {
    const { container } = render(<SharingAvatars users={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders avatar initials for shared users', () => {
    render(
      <SharingAvatars
        users={[
          {
            UserId: 'user-1',
            Username: 'jamie',
            FirstName: 'Jamie',
            LastName: 'Lee',
          },
        ]}
        isOwner
      />
    );

    expect(screen.getByLabelText('Shared with Jamie Lee')).toBeInTheDocument();
    expect(screen.getByText('Shared with')).toBeInTheDocument();
    expect(screen.getByText('JL')).toBeInTheDocument();
  });
});
