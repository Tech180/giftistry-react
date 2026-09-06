import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SelectMenu } from './select-menu.component';

const OPTIONS = [
  { value: 'viewer', label: 'Can View', description: 'Read-only' },
  { value: 'collaborator', label: 'Can Edit', description: 'Can edit items' },
];

describe('SelectMenu', () => {
  test('opens listbox and selects a value', () => {
    const onChange = vi.fn();
    render(
      <SelectMenu
        value="viewer"
        options={OPTIONS}
        onChange={onChange}
        menuTitle="Select Role"
        aria-label="Role"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Select Role')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: /Can Edit/i }));
    expect(onChange).toHaveBeenCalledWith('collaborator');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('closes on Escape and returns focus to the trigger', () => {
    render(
      <SelectMenu value="viewer" options={OPTIONS} onChange={vi.fn()} aria-label="Role" />
    );

    const trigger = screen.getByRole('button', { name: 'Role' });
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test('closes on outside click', () => {
    render(
      <div>
        <SelectMenu value="viewer" options={OPTIONS} onChange={vi.fn()} aria-label="Role" />
        <button type="button">Outside</button>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('moves highlight with arrows and selects with Enter', () => {
    const onChange = vi.fn();
    render(
      <SelectMenu value="viewer" options={OPTIONS} onChange={onChange} aria-label="Role" />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('collaborator');
  });

  test('does not open when disabled', () => {
    render(
      <SelectMenu
        value="viewer"
        options={OPTIONS}
        onChange={vi.fn()}
        disabled
        aria-label="Role"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('positions with mocked getBoundingClientRect', () => {
    const triggerRect = {
      top: 100,
      bottom: 132,
      left: 200,
      width: 120,
      height: 32,
      right: 320,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    };
    const menuRect = {
      top: 0,
      bottom: 160,
      left: 0,
      width: 220,
      height: 160,
      right: 220,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };

    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if ((this as HTMLElement).getAttribute('role') === 'listbox') {
        return menuRect as DOMRect;
      }
      return triggerRect as DOMRect;
    };

    try {
      render(
        <SelectMenu value="viewer" options={OPTIONS} onChange={vi.fn()} aria-label="Role" />
      );
      fireEvent.click(screen.getByRole('button', { name: 'Role' }));
      const listbox = screen.getByRole('listbox');
      expect(listbox.style.top).toBe('138px');
      expect(listbox.style.left).toBe('150px');
    } finally {
      Element.prototype.getBoundingClientRect = original;
    }
  });
});
