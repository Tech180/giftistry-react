import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Drawer } from './drawer.component';

describe('Drawer', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.removeAttribute('data-drawer-sheet-open');
  });

  test('default rail does not render a scrim', () => {
    render(
      <Drawer isOpen title="Rail" position="right" onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>
    );

    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
    expect(screen.getByTestId('drawer-panel').className).not.toMatch(/sheet/);
  });

  test('sheet presentation shows scrim when open and applies sheet class', () => {
    render(
      <Drawer
        isOpen
        title="Comments"
        position="right"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    expect(screen.getByTestId('drawer-scrim')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-scrim').className).toMatch(/overlay-active/);
    expect(screen.getByTestId('drawer-panel').className).toMatch(/sheet/);
  });

  test('sheet presentation locks body scroll and sets open attribute', () => {
    const { unmount } = render(
      <Drawer
        isOpen
        title="Add Item"
        position="left"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Form</p>
      </Drawer>
    );

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.getAttribute('data-drawer-sheet-open')).toBe('true');

    unmount();

    expect(document.body.getAttribute('data-drawer-sheet-open')).toBeNull();
  });

  test('sheet scrim click calls onClose', () => {
    const onClose = vi.fn();
    render(
      <Drawer
        isOpen
        title="Comments"
        position="right"
        onClose={onClose}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    fireEvent.click(screen.getByTestId('drawer-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closed sheet does not lock body or activate scrim', () => {
    render(
      <Drawer
        isOpen={false}
        title="Comments"
        position="right"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.body.getAttribute('data-drawer-sheet-open')).toBeNull();
    expect(screen.getByTestId('drawer-scrim').className).not.toMatch(/overlay-active/);
  });
});
