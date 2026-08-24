import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import UserProfile from './user-profile.component';

const getUserPreview = vi.fn();

vi.mock('features/auth', () => ({
  authApi: {
    getUserPreview: (...args: unknown[]) => getUserPreview(...args),
  },
}));

vi.mock('app/providers/theme-context', () => ({
  useTheme: () => ({
    tryTheme: vi.fn(),
  }),
}));

function renderProfile(userId = 'user-1') {
  return render(
    <MemoryRouter initialEntries={[`/users/${userId}`]}>
      <Routes>
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('UserProfile', () => {
  beforeEach(() => {
    getUserPreview.mockReset();
  });

  test('loads preview data into the profile layout', async () => {
    getUserPreview.mockResolvedValue({
      User: {
        Id: 'user-1',
        Username: 'ada',
        FirstName: 'Ada',
        LastName: 'Lovelace',
        Email: null,
        Bio: 'Mathematician',
        CreatedAt: '2024-01-15T00:00:00.000Z',
        ActiveListsCount: 3,
        ArchivedListsCount: 1,
        MutualsCount: 2,
        Theme: 'default',
      },
    });

    renderProfile();

    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    });
    expect(screen.getByText('@ada')).toBeInTheDocument();
    expect(screen.getByText('Mathematician')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try theme/i })).toBeInTheDocument();
    expect(getUserPreview).toHaveBeenCalledWith('user-1');
  });

  test('shows error state when preview fails', async () => {
    getUserPreview.mockRejectedValue(new Error('User not found'));

    renderProfile('missing');

    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument();
    });
  });

  test('renders self profile as public layout without settings editor', async () => {
    getUserPreview.mockResolvedValue({
      User: {
        Id: 'me',
        Username: 'me',
        FirstName: 'Me',
        LastName: 'Self',
        Email: null,
        Bio: '',
        CreatedAt: '2023-06-01T00:00:00.000Z',
      },
    });

    renderProfile('me');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Me Self' })).toBeInTheDocument();
    });
    expect(screen.queryByText(/settings/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });
});
