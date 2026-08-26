import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ADD_SUBSTITUTION_ACTION_LABEL } from '../../../../constants/substitution-messages.constant';
import { SubstitutionClaimButton } from './claim-button.component';

describe('SubstitutionClaimButton', () => {
  it('opens the editor directly when substitutions are allowed', () => {
    const onOpenEditor = vi.fn();
    render(<SubstitutionClaimButton allowSubstitutions onOpenEditor={onOpenEditor} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add custom substitution' }));
    expect(onOpenEditor).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('heading', { name: 'Add custom substitution' })).not.toBeInTheDocument();
  });

  it('uses a two-step confirm when substitutions are disabled', () => {
    const onOpenEditor = vi.fn();
    render(<SubstitutionClaimButton allowSubstitutions={false} onOpenEditor={onOpenEditor} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add custom substitution' }));
    expect(screen.getByRole('button', { name: 'Continue anyway' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continue anyway' }));
    expect(screen.getByRole('heading', { name: 'Substitutions disabled' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onOpenEditor).toHaveBeenCalledTimes(1);
  });

  it('renders ghost-text appearance with the footer label', () => {
    const onOpenEditor = vi.fn();
    render(
      <SubstitutionClaimButton
        allowSubstitutions
        appearance="ghost-text"
        onOpenEditor={onOpenEditor}
      />
    );

    expect(
      screen.getByRole('button', { name: ADD_SUBSTITUTION_ACTION_LABEL })
    ).toBeInTheDocument();
  });

  it('shows edit and delete controls in manage mode', async () => {
    const onOpenEditor = vi.fn();
    const onDelete = vi.fn().mockResolvedValue(undefined);
    render(
      <SubstitutionClaimButton
        mode="manage"
        allowSubstitutions
        appearance="ghost-text"
        onOpenEditor={onOpenEditor}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit substitution' }));
    expect(onOpenEditor).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Delete substitution' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
