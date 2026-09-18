import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RegisterFormTemplate } from './register-form.html';
import type { RegisterFormTemplateProps } from '../../interfaces/register-form-template-props.interface';

const baseProps: RegisterFormTemplateProps = {
  username: '',
  setUsername: vi.fn(),
  email: '',
  setEmail: vi.fn(),
  firstName: '',
  setFirstName: vi.fn(),
  lastName: '',
  setLastName: vi.fn(),
  password: '',
  setPassword: vi.fn(),
  confirmPassword: '',
  setConfirmPassword: vi.fn(),
  isLoading: false,
  localError: null,
  handleSubmit: vi.fn(),
};

function renderForm(overrides: Partial<RegisterFormTemplateProps> = {}) {
  return render(
    <MemoryRouter>
      <RegisterFormTemplate {...baseProps} {...overrides} />
    </MemoryRouter>
  );
}

describe('RegisterFormTemplate', () => {
  test('shows closed message and disables submit when registrationClosed', () => {
    renderForm({
      registrationClosed: true,
      registrationClosedMessage: 'Registration is invite-only. Use a valid invite link from an administrator.',
    });
    expect(
      screen.getByText('Registration is invite-only. Use a valid invite link from an administrator.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled();
  });

  test('enables submit when registration is open', () => {
    renderForm({ registrationClosed: false });
    expect(screen.getByRole('button', { name: 'Create Account' })).not.toBeDisabled();
  });
});
