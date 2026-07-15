import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClaimAnonymousToggle } from './claim-anonymous-toggle.html';

describe('ClaimAnonymousToggle', () => {
  it('renders anonymously label with switch', () => {
    render(<ClaimAnonymousToggle checked={false} onChange={() => {}} />);

     expect(screen.getByText('Anonymously')).toBeInTheDocument();
     expect(screen.getByRole('checkbox', { name: 'Claim anonymously' })).toBeInTheDocument();
  });

  it('calls onChange when toggled', () => {
    const onChange = vi.fn();

    render(<ClaimAnonymousToggle checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Claim anonymously' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
