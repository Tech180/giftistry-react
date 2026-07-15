import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const mockUpdateAiEnabled = vi.fn();
const mockUpdateWebSearchEnabled = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../api/auth.api', () => ({
  authApi: {
    disableAccount: vi.fn(),
    deleteAccount: vi.fn(),
  },
}));

import { ProfileCard } from './profile-card.component';

const baseUser = {
  Id: 'user-1',
  Username: 'testuser',
  Email: 'test@example.com',
  FirstName: 'Test',
  LastName: 'User',
  Bio: '',
  Avatar: 'hsl(200, 70%, 45%)',
  AiEnabled: true,
  WebSearchEnabled: true,
  Policy: { CanUseAiFeatures: true },
};

describe('ProfileCard AI badge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAiEnabled.mockResolvedValue({ ...baseUser, AiEnabled: false });
    mockUpdateWebSearchEnabled.mockResolvedValue({ ...baseUser, WebSearchEnabled: false });
    mockUseAuth.mockReturnValue({
      user: baseUser,
      updateProfile: vi.fn(),
      updateAiEnabled: mockUpdateAiEnabled,
      updateWebSearchEnabled: mockUpdateWebSearchEnabled,
      logout: vi.fn(),
      canShowAiSettings: true,
      canShowWebSearchSettings: true,
    });
  });

  test('shows AI Enabled badge when user can use AI and preference is on', () => {
    render(<ProfileCard />);

    expect(screen.getByText('AI Features')).toBeInTheDocument();
    expect(screen.getByText('AI Enabled')).toBeInTheDocument();
  });

  test('shows AI Disabled badge when user preference is off', () => {
    mockUseAuth.mockReturnValue({
      user: { ...baseUser, AiEnabled: false },
      updateProfile: vi.fn(),
      updateAiEnabled: mockUpdateAiEnabled,
      logout: vi.fn(),
      canShowAiSettings: true,
    });

    render(<ProfileCard />);

    expect(screen.getByText('AI Disabled')).toBeInTheDocument();
  });

  test('hides AI badge when AI is not available', () => {
    mockUseAuth.mockReturnValue({
      user: baseUser,
      updateProfile: vi.fn(),
      updateAiEnabled: mockUpdateAiEnabled,
      logout: vi.fn(),
      canShowAiSettings: false,
    });

    render(<ProfileCard />);

    expect(screen.queryByText('AI Enabled')).not.toBeInTheDocument();
    expect(screen.queryByText('AI Disabled')).not.toBeInTheDocument();
    expect(screen.queryByText("AI isn't enabled on this server.")).not.toBeInTheDocument();
  });

  test('clicking badge toggles AI preference', async () => {
    render(<ProfileCard />);

    fireEvent.click(screen.getByRole('button', { name: /AI features enabled/i }));

    await waitFor(() => {
      expect(mockUpdateAiEnabled).toHaveBeenCalledWith(false);
    });
  });

  test('shows web search toggle in AI features section when available', () => {
    render(<ProfileCard />);

    expect(screen.getByText('AI Features')).toBeInTheDocument();
    expect(screen.getByText('Web Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Web search enabled/i })).toHaveTextContent('Enabled');
  });

  test('clicking web search toggle toggles preference', async () => {
    render(<ProfileCard />);

    fireEvent.click(screen.getByRole('button', { name: /Web search enabled/i }));

    await waitFor(() => {
      expect(mockUpdateWebSearchEnabled).toHaveBeenCalledWith(false);
    });
  });
});
