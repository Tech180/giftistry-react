import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { CreateListFormTemplate } from './create-list-form.html';
import type { CreateListFormTemplateProps } from '../../interfaces/create-list-form-template-props.interface';

const baseProps: CreateListFormTemplateProps = {
  title: 'Party',
  setTitle: vi.fn(),
  expiresAt: '',
  setExpiresAt: vi.fn(),
  allowGroupFunds: false,
  setAllowGroupFunds: vi.fn(),
  isLoading: false,
  errorMsg: null,
  handleSubmit: vi.fn(),
  category: 'generic',
  setCategory: vi.fn(),
  customCategory: '',
  setCustomCategory: vi.fn(),
  aiEnabled: false,
  setAiEnabled: vi.fn(),
  webSearchEnabled: false,
  setWebSearchEnabled: vi.fn(),
  autoRollover: true,
  setAutoRollover: vi.fn(),
  globalAiEnabled: false,
  globalWebSearchEnabled: false,
};

describe('CreateListFormTemplate', () => {
  test('does not show Reveal Suggestions toggle', () => {
    render(<CreateListFormTemplate {...baseProps} />);
    expect(screen.queryByText('Reveal Suggestions')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reveal Suggestions')).not.toBeInTheDocument();
  });

  test('advanced options are collapsed by default', () => {
    render(<CreateListFormTemplate {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Advanced Options' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.queryByLabelText('Group Funding')).not.toBeInTheDocument();
  });

  test('expanding advanced options reveals toggles', () => {
    render(<CreateListFormTemplate {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Advanced Options' }));
    expect(screen.getByRole('button', { name: 'Advanced Options' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByLabelText('Group Funding')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto Rollover')).toBeInTheDocument();
  });
});
