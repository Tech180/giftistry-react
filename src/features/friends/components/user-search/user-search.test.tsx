import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserSearch } from './user-search.component';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'test-user-id' } }),
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({ theme: 'light', tryTheme: vi.fn() }),
}));

describe('UserSearch', () => {
  it('does not show users who are already friends', () => {
    render(
      <UserSearch
        searchResults={[
          { Id: 'friend-1', Username: 'alice', FirstName: 'Alice', LastName: 'Smith' },
          { Id: 'stranger-1', Username: 'bob', FirstName: 'Bob', LastName: 'Jones' },
        ]}
        isSearching={false}
        onSearch={() => {}}
        onSendRequest={() => {}}
        existingFriendIds={['friend-1']}
      />
    );

    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
  });
});
