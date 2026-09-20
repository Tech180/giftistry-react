import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton.component';
import { ITEM_VIEW_MODES } from '../../constants/item-view-mode.constants';
import { LOADING_LABEL } from './constants/loading-label.constant';

describe('Skeleton', () => {
  test('marks the detailed placeholder as busy', () => {
    render(<Skeleton viewMode="detailed" />);

    const placeholder = screen.getByLabelText(LOADING_LABEL);
    expect(placeholder).toHaveAttribute('aria-busy', 'true');
  });

  test.each(ITEM_VIEW_MODES)('renders shimmer bars for %s view', (viewMode) => {
    const { container } = render(<Skeleton viewMode={viewMode} />);

    expect(screen.getByLabelText(LOADING_LABEL)).toBeInTheDocument();
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });
});
