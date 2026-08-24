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

  it('increments without an upper bound when max is omitted', () => {
    const onChange = vi.fn();
    render(<NumberSelector value={5} min={1} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Increase' })).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('lets the user click the value and type a custom number', () => {
    const onChange = vi.fn();
    render(<NumberSelector value={2} min={0} max={99} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit quantity' }));
    const input = screen.getByRole('textbox', { name: 'Edit quantity' });
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(12);
  });

  it('shows infinity when value is 0 and zeroAsInfinity is set', () => {
    const onChange = vi.fn();
    render(
      <NumberSelector
        value={0}
        min={0}
        onChange={onChange}
        zeroAsInfinity
      />
    );

    expect(screen.getByRole('button', { name: 'Edit quantity (0 is unlimited)' })).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('commits typed 0 when min allows it', () => {
    const onChange = vi.fn();
    render(
      <NumberSelector
        value={3}
        min={0}
        onChange={onChange}
        zeroAsInfinity
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit quantity' }));
    const input = screen.getByRole('textbox', { name: 'Edit quantity' });
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(0);
  });
});
