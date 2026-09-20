import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RegisterFormTemplate } from './register-form.html';
import type { TemplateProps } from './interfaces/template-props.interface';

const baseProps: TemplateProps = {
  inviteValidating: false,
  registrationClosed: false,
  localError: null,
  handleSubmit: vi.fn(),
  fields: <div data-testid="fields-stub" />,
  actions: <button type="submit">Create Account</button>,
};

function renderForm(overrides: Partial<TemplateProps> = {}) {
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
      registrationClosedMessage:
        'Registration is invite-only. Use a valid invite link from an administrator.',
      actions: (
        <button type="submit" disabled>
          Create Account
        </button>
      ),
    });
    expect(
      screen.getByText(
        'Registration is invite-only. Use a valid invite link from an administrator.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled();
  });

  test('enables submit when registration is open', () => {
    renderForm({ registrationClosed: false });
    expect(screen.getByRole('button', { name: 'Create Account' })).not.toBeDisabled();
  });
});
