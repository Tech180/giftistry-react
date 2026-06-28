import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button.component';

describe('Button Primitive', () => {
  test('renders children content correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('displays loading spinner when isLoading is true', () => {
    render(<Button isLoading>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
    const spinner = screen.getByRole('button').querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
