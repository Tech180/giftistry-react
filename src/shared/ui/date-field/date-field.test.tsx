import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DateField } from './date-field.component';

describe('DateField', () => {
  test('opens calendar from icon and selects a day', () => {
    const onChange = vi.fn();
    render(<DateField label="Date (Optional)" value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(screen.getByRole('dialog', { name: /Choose Date/i })).toBeInTheDocument();

    const dayButtons = screen.getAllByRole('gridcell');
    const selectable = dayButtons.find((btn) => btn.getAttribute('aria-label')?.startsWith('202'));
    expect(selectable).toBeTruthy();
    fireEvent.click(selectable!);
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('applies a quick pick and clear', () => {
    const onChange = vi.fn();
    const { rerender } = render(<DateField label="Expires" value="" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));

    const selected = onChange.mock.calls[0][0] as string;
    onChange.mockClear();
    rerender(<DateField label="Expires" value={selected} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  test('commits typed MM/DD/YYYY on blur and shows readable date', () => {
    const onChange = vi.fn();
    const { rerender } = render(<DateField label="Date" value="" onChange={onChange} />);

    const input = screen.getByLabelText('Date');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '01/01/2000' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith('2000-01-01');

    rerender(<DateField label="Date" value="2000-01-01" onChange={onChange} />);
    expect(screen.getByLabelText('Date')).toHaveValue('Jan 1, 2000');
  });

  test('closes calendar on Escape', () => {
    render(<DateField label="Date" value="" onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open calendar' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
