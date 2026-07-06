import React from 'react';
import { render, screen } from '@testing-library/react';
import styles from './loading-state.module.css';
import { LoadingState } from './loading-state.component';

describe('LoadingState', () => {
  test('renders default loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders custom message', () => {
    render(<LoadingState message="Fetching data..." />);
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  test('applies fullHeight class when enabled', () => {
    const { container } = render(<LoadingState fullHeight />);
    expect(container.firstChild).toHaveClass(styles['full-height']);
  });
});
