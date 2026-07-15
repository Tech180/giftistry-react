import React from 'react';
import { render, screen } from '@testing-library/react';
import { ClaimPrompt } from './claim-prompt.html';

describe('ClaimPrompt', () => {
  it('stacks anonymous toggle under the claim prompt', () => {
    render(<ClaimPrompt anonymous={false} onAnonymousChange={() => {}} />);

    const prompt = screen.getByText('Claim this item?');
    const label = screen.getByText('Anonymously');

    expect(prompt.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
