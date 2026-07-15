import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserAvatarBox } from './user-avatar-box.html';

describe('UserAvatarBox', () => {
  it('renders a compact title strip above avatar content', () => {
    render(
      <UserAvatarBox title="Shared with" ariaLabel="Shared with Jamie Lee">
        <span>Avatar</span>
      </UserAvatarBox>
    );

    expect(screen.getByText('Shared with')).toBeInTheDocument();
    expect(screen.getByLabelText('Shared with Jamie Lee')).toBeInTheDocument();
    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });
});
