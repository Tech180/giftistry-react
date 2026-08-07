import React from 'react';
import { render, screen } from '@testing-library/react';
import { ItemCardSkeleton } from './item-card-skeleton.component';
import { ITEM_VIEW_MODES } from '../../constants/item-view-mode.constants';

describe('ItemCardSkeleton', () => {
  test('marks the detailed placeholder as busy', () => {
    render(<ItemCardSkeleton viewMode="detailed" />);

    const placeholder = screen.getByLabelText('Loading item details');
    expect(placeholder).toHaveAttribute('aria-busy', 'true');
  });

  test.each(ITEM_VIEW_MODES)('renders shimmer bars for %s view', (viewMode) => {
    const { container } = render(<ItemCardSkeleton viewMode={viewMode} />);

    expect(screen.getByLabelText('Loading item details')).toBeInTheDocument();
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });
});
