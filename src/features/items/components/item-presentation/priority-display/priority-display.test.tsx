import { render, screen } from '@testing-library/react';
import { PriorityDisplay } from './priority-display.html';

describe('PriorityDisplay', () => {
  it('renders label and value on separate lines', () => {
    render(<PriorityDisplay priority={66} variant="badge" />);

    expect(screen.getByText('Priority:')).toBeInTheDocument();
    expect(screen.getByText('66')).toBeInTheDocument();
  });

  it('renders optional hint copy', () => {
    render(<PriorityDisplay priority={1} variant="stacked" showHint />);

    expect(screen.getByText('(1 is highest)')).toBeInTheDocument();
  });
});
