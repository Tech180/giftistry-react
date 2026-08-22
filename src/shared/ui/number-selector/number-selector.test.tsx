import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { NumberSelector } from './number-selector.component';

describe('NumberSelector', () => {
  it('increments and decrements within min and max', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberSelector value={1} min={0} max={3} onChange={onChange} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenCalledWith(2);

    rerender(<NumberSelector value={1} min={0} max={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('disables decrement at min and increment at max', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberSelector value={0} min={0} max={2} onChange={onChange} />
    );

    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(onChange).not.toHaveBeenCalled();

    rerender(<NumberSelector value={2} min={0} max={2} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays a value clamped to min and max without emitting', () => {
    const onChange = vi.fn();
    render(<NumberSelector value={9} min={0} max={2} onChange={onChange} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not change when disabled', () => {
    const onChange = vi.fn();
    render(
      <NumberSelector value={1} min={0} max={3} onChange={onChange} disabled />
    );

    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
