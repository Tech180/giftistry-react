import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SubstitutionBadge } from './badge.component';

vi.mock('shared/ui/user-preview-card/user-preview-card.component', () => ({
  UserPreviewCard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SubstitutionBadge', () => {
  it('renders owner-approved as a text chip', () => {
    render(<SubstitutionBadge kind="owner_approved" />);
    expect(screen.getByText('Owner approved')).toBeInTheDocument();
  });

  it('renders claimer custom as a Substitution avatar box', () => {
    render(
      <SubstitutionBadge kind="claimer_custom" createdByUserId="user-1" createdByDisplayName="Ada" />
    );
    expect(screen.getByLabelText('Substitution by Ada')).toBeInTheDocument();
    expect(screen.getByText('Substitution')).toBeInTheDocument();
  });

  it('returns null for original', () => {
    const { container } = render(<SubstitutionBadge kind="original" />);
    expect(container).toBeEmptyDOMElement();
  });
});
