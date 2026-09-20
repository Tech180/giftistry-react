import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { CreateFormTemplate } from './create-form.html';
import type { TemplateProps } from './interfaces/template-props.interface';

const baseProps: Omit<TemplateProps, 'advancedOpen' | 'setAdvancedOpen'> = {
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

const Harness: React.FC<{ initialOpen?: boolean }> = ({ initialOpen = false }) => {
  const [advancedOpen, setAdvancedOpen] = useState(initialOpen);
  return (
    <CreateFormTemplate
      {...baseProps}
      advancedOpen = {
        advancedOpen
      }
      setAdvancedOpen = {
        setAdvancedOpen
      }
    />
  );
};

describe('CreateFormTemplate', () => {
  test('does not show Reveal Suggestions toggle', () => {
    render(<Harness />);
    expect(screen.queryByText('Reveal Suggestions')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Reveal Suggestions')).not.toBeInTheDocument();
  });

  test('advanced options are collapsed by default', () => {
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Advanced Options' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.queryByLabelText('Group Funding')).not.toBeInTheDocument();
  });

  test('expanding advanced options reveals toggles', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Advanced Options' }));
    expect(screen.getByRole('button', { name: 'Advanced Options' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByLabelText('Group Funding')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto Rollover')).toBeInTheDocument();
  });

  test('shows date field trigger for optional expiration', () => {
    render(<Harness />);
    expect(screen.getByLabelText('Date (Optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeInTheDocument();
  });
});
