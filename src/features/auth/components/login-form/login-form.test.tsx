import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { LoginFormTemplate } from './login-form.html';
import type { TemplateProps } from './interfaces/template-props.interface';

const baseProps: TemplateProps = {
  username: '',
  setUsername: vi.fn(),
  password: '',
  setPassword: vi.fn(),
  isLoading: false,
  localError: null,
  handleSubmit: vi.fn(),
  step: 'credentials',
  setStep: vi.fn(),
  totpCode: '',
  setTotpCode: vi.fn(),
  handleTotpSubmit: vi.fn(),
  handlePasskeyLogin: vi.fn(),
  switcherAccounts: [],
  handleSwitcherSelect: vi.fn(),
  handleRemoveSwitcherAccount: vi.fn(),
  isBiometricModalOpen: false,
  biometricLabel: '',
  cancelBiometrics: vi.fn(),
  allowPasswordLogin: true,
  oauthEnabled: false,
  oauthButtonText: 'Sign in with SSO',
  handleOauthLogin: vi.fn(),
  showRegisterLink: true,
  showPassword: false,
  onToggleShowPassword: vi.fn(),
};

function renderLoginForm(overrides: Partial<TemplateProps> = {}) {
  return render(
    <MemoryRouter>
      <LoginFormTemplate {...baseProps} {...overrides} />
    </MemoryRouter>
  );
}

describe('LoginFormTemplate', () => {
  test('shows Create an account when showRegisterLink is true', () => {
    renderLoginForm({ showRegisterLink: true });
    expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute(
      'href',
      '/register'
    );
    expect(screen.getByText('New to Giftistry?')).toBeInTheDocument();
  });

  test('hides Create an account when showRegisterLink is false', () => {
    renderLoginForm({ showRegisterLink: false });
    expect(screen.queryByRole('link', { name: 'Create an account' })).not.toBeInTheDocument();
    expect(screen.queryByText('New to Giftistry?')).not.toBeInTheDocument();
  });

  test('shows localError alert when provided', () => {
    renderLoginForm({
      localError: 'This invitation link is invalid or has expired.',
    });
    expect(
      screen.getByText('This invitation link is invalid or has expired.')
    ).toBeInTheDocument();
  });
});
