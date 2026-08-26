import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubstitutionCounterBadge } from './counter-badge.component';

describe('SubstitutionCounterBadge', () => {
  it('renders Main Item only on the original option', () => {
    render(<SubstitutionCounterBadge activeIndex={0} total={2} isOriginal />);

    expect(screen.getByRole('status')).toHaveTextContent('Main Item');
    expect(screen.getByRole('status')).not.toHaveTextContent('/');
  });

  it('renders Substitution label and fraction among substitutions only', () => {
    render(<SubstitutionCounterBadge activeIndex={1} total={3} isOriginal={false} />);

    expect(screen.getByRole('status')).toHaveTextContent('Substitution1/2');
  });

  it('shows the last substitution as N/N', () => {
    render(<SubstitutionCounterBadge activeIndex={2} total={3} isOriginal={false} />);

    expect(screen.getByRole('status')).toHaveTextContent('Substitution2/2');
  });
});
