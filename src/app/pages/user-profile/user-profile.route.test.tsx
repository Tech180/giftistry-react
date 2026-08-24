import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { ProtectedRoute } from 'app/routes/protected-route.component';
import UserProfile from 'app/pages/user-profile/user-profile.component';

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

vi.mock('features/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('features/auth')>();
  return {
    ...actual,
    authApi: {
      ...actual.authApi,
      getUserPreview: vi.fn(),
    },
    postAuthPath: () => '/dashboard',
  };
});

describe('User profile route protection', () => {
  test('redirects logged-out visitors from /users/:userId to login', () => {
    render(
      <MemoryRouter initialEntries={['/users/abc']}>
        <Routes>
          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
  });
});
