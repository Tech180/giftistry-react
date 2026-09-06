import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ClaimPrompt } from './claim-prompt.html';

describe('ClaimPrompt', () => {
  test('stacks anonymous toggle under the claim prompt', () => {
    render(<ClaimPrompt anonymous={false} onAnonymousChange={() => {}} />);

    const prompt = screen.getByText('Claim this item?');
    const label = screen.getByText('Anonymously');

    expect(prompt.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('shows start group funding toggle and amount when enabled', () => {
    const onGroupFundingEnabledChange = vi.fn();
    const onClaimAmountChange = vi.fn();

    render(
      <ClaimPrompt
        anonymous={false}
        onAnonymousChange={() => {}}
        showGroupFunding
        groupFundingEnabled
        onGroupFundingEnabledChange={onGroupFundingEnabledChange}
        claimAmount="12.5"
        onClaimAmountChange={onClaimAmountChange}
        remainingAmount={40}
      />
    );

    expect(screen.getByLabelText('Start group funding')).toBeTruthy();
    expect(screen.getByText('Up to $40.00 remaining')).toBeTruthy();
    const amount = screen.getByLabelText('Contribution amount') as HTMLInputElement;
    expect(amount.value).toBe('12.5');
    fireEvent.change(amount, { target: { value: '20' } });
    expect(onClaimAmountChange).toHaveBeenCalledWith('20');
  });

  test('forces contribute mode when group funding already started', () => {
    render(
      <ClaimPrompt
        anonymous={false}
        onAnonymousChange={() => {}}
        showGroupFunding
        groupFundingStarted
        groupFundingEnabled={false}
        remainingAmount={15}
      />
    );

    const toggle = screen.getByLabelText('Contribute to group funding') as HTMLInputElement;
    expect(toggle.disabled || toggle.getAttribute('aria-disabled') === 'true' || toggle.disabled).toBeTruthy();
    expect(screen.getByText('Up to $15.00 remaining')).toBeTruthy();
  });
});
